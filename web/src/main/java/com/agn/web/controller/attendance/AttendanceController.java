package com.agn.web.controller.attendance;

import com.agn.web.entity.attendance.Attendance;
import com.agn.web.service.attendance.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }
    
    @PostMapping
    public ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.saveAttendance(attendance));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {
        attendance.setId(id);
        return ResponseEntity.ok(attendanceService.saveAttendance(attendance));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }
    
    @GetMapping("/statistics/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getAttendanceStatistics(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentStatistics(studentId));
    }
}
