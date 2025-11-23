package com.agn.web.entity.schedule;

import com.agn.web.entity.group.Group;
import com.agn.web.entity.lesson.LessonType;
import com.agn.web.entity.subject.Subject;
import com.agn.web.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * Расписание занятия.
 * Администратор заполняет все поля: дату, время начала и окончания, группы, предмет, преподавателя и тип занятия.
 */
@Entity
@Table(name = "schedule_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @ManyToMany
    @JoinTable(name = "schedule_item_groups",
            joinColumns = @JoinColumn(name = "schedule_item_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id"))
    private Set<Group> groups;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    /** Тип занятия – лекция, лабораторная, практическая */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonType lessonType;
}
