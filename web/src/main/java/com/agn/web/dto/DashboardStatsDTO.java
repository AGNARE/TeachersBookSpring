package com.agn.web.dto;

import java.util.List;

public record DashboardStatsDTO(
    long totalStudents,
    long totalGroups,
    double averageGrade,
    long lessonsToday,
    List<LessonDTO> upcomingLessons
) {}
