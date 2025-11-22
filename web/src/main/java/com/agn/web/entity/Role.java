package com.agn.web.entity;

public enum Role {
    ADMIN,    // Полный доступ ко всему
    TEACHER,  // Доступ к своим дисциплинам, группам, студентам
    STUDENT   // Только просмотр своей успеваемости
}
