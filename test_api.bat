@echo off
REM ============================================
REM TeachersBook API Test Script
REM Автоматизированное тестирование API
REM ============================================

echo.
echo ========================================
echo TeachersBook API Testing Suite
echo ========================================
echo.

set BASE_URL=http://localhost:8181/api
set PASSED=0
set FAILED=0

REM Проверка доступности сервера
echo [1/10] Checking server availability...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/dashboard/stats > temp.txt
set /p STATUS=<temp.txt
if "%STATUS%"=="200" (
    echo [OK] Server is running
    set /a PASSED+=1
) else (
    echo [FAIL] Server is not responding (Status: %STATUS%)
    set /a FAILED+=1
)
del temp.txt
echo.

REM Тест 1: Login с правильными учетными данными
echo [2/10] Testing login with valid credentials...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin\"}" > response.json

findstr /C:"token" response.json >nul
if %errorlevel%==0 (
    echo [OK] Login successful
    set /a PASSED+=1
) else (
    echo [FAIL] Login failed
    type response.json
    set /a FAILED+=1
)
del response.json
echo.

REM Тест 2: Login с неправильными учетными данными
echo [3/10] Testing login with invalid credentials...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"wrong\",\"password\":\"wrong\"}" ^
  -w "%%{http_code}" -o nul > temp.txt
set /p STATUS=<temp.txt
if NOT "%STATUS%"=="200" (
    echo [OK] Invalid login rejected (Status: %STATUS%)
    set /a PASSED+=1
) else (
    echo [FAIL] Invalid login accepted
    set /a FAILED+=1
)
del temp.txt
echo.

REM Тест 3: Генерация учетных данных
echo [4/10] Testing credentials generation...
curl -s -X POST %BASE_URL%/users/generate-credentials ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\"}" > response.json

findstr /C:"username" response.json >nul
if %errorlevel%==0 (
    echo [OK] Credentials generated
    type response.json
    set /a PASSED+=1
) else (
    echo [FAIL] Credentials generation failed
    set /a FAILED+=1
)
del response.json
echo.

REM Тест 4: Получение списка преподавателей
echo [5/10] Testing get teachers list...
curl -s %BASE_URL%/users/teachers > response.json
findstr /C:"[" response.json >nul
if %errorlevel%==0 (
    echo [OK] Teachers list received
    set /a PASSED+=1
) else (
    echo [FAIL] Failed to get teachers list
    set /a FAILED+=1
)
del response.json
echo.

REM Тест 5: Получение списка студентов
echo [6/10] Testing get students list...
curl -s %BASE_URL%/users/students > response.json
findstr /C:"[" response.json >nul
if %errorlevel%==0 (
    echo [OK] Students list received
    set /a PASSED+=1
) else (
    echo [FAIL] Failed to get students list
    set /a FAILED+=1
)
del response.json
echo.

REM Тест 6: Получение статистики Dashboard
echo [7/10] Testing dashboard stats...
curl -s %BASE_URL%/dashboard/stats > response.json
findstr /C:"totalStudents" response.json >nul
if %errorlevel%==0 (
    echo [OK] Dashboard stats received
    type response.json
    set /a PASSED+=1
) else (
    echo [FAIL] Dashboard stats failed
    set /a FAILED+=1
)
del response.json
echo.

REM Тест 7: Получение списка всех студентов (полная информация)
echo [8/10] Testing get all students (full info)...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/students > temp.txt
set /p STATUS=<temp.txt
if "%STATUS%"=="200" (
    echo [OK] Students endpoint accessible (Status: %STATUS%)
    set /a PASSED+=1
) else (
    echo [FAIL] Students endpoint failed (Status: %STATUS%)
    set /a FAILED+=1
)
del temp.txt
echo.

REM Тест 8: Получение списка предметов
echo [9/10] Testing get subjects...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/subjects > temp.txt
set /p STATUS=<temp.txt
if "%STATUS%"=="200" (
    echo [OK] Subjects endpoint accessible (Status: %STATUS%)
    set /a PASSED+=1
) else (
    echo [FAIL] Subjects endpoint failed (Status: %STATUS%)
    set /a FAILED+=1
)
del temp.txt
echo.

REM Тест 9: Получение списка групп
echo [10/10] Testing get groups...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/groups > temp.txt
set /p STATUS=<temp.txt
if "%STATUS%"=="200" (
    echo [OK] Groups endpoint accessible (Status: %STATUS%)
    set /a PASSED+=1
) else (
    echo [FAIL] Groups endpoint failed (Status: %STATUS%)
    set /a FAILED+=1
)
del temp.txt
echo.

REM Итоговая статистика
echo ========================================
echo Test Summary
echo ========================================
echo Total Tests: 10
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED%==0 (
    echo [SUCCESS] All tests passed!
    echo.
    exit /b 0
) else (
    echo [ATTENTION] Some tests failed.
    echo Please check the output above for details.
    echo.
    exit /b 1
)
