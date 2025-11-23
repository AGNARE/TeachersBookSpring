package com.agn.web.entity.user;

public enum Role {
    ADMIN,    // Полный доступ ко всему
    TEACHER,  // Доступ к своим дисциплинам, группам, студентам
    STUDENT   // Только просмотр своей успеваемости
}
