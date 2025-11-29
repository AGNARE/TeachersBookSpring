package com.agn.web.dto.schedule;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * DTO for creating / updating ScheduleItem.
 * Uses IDs for related entities to keep the payload simple.
 */
public class ScheduleItemDTO {

    private Long id;

    @NotNull
    @FutureOrPresent(message = "Дата должна быть в настоящем или будущем")
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotEmpty(message = "Необходимо указать хотя бы одну группу")
    private Set<Long> groupIds;

    @NotNull(message = "Необходимо указать предмет")
    private Long subjectId;

    @NotNull(message = "Необходимо указать преподавателя")
    private Long teacherId;

    @NotNull(message = "Необходимо указать тип занятия")
    private com.agn.web.entity.lesson.LessonType lessonType;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Set<Long> getGroupIds() { return groupIds; }
    public void setGroupIds(Set<Long> groupIds) { this.groupIds = groupIds; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    public com.agn.web.entity.lesson.LessonType getLessonType() { return lessonType; }
    public void setLessonType(com.agn.web.entity.lesson.LessonType lessonType) { this.lessonType = lessonType; }
}
