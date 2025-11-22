package com.agn.web.dto;

import java.time.LocalDateTime;

public record LessonDTO(
    Long id,
    String subjectName,
    String groupName,
    String type,
    LocalDateTime startTime,
    LocalDateTime endTime
) {}
