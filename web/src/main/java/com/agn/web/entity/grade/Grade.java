package com.agn.web.entity.grade;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.agn.web.entity.student.Student;
import com.agn.web.entity.subject.Subject;
import com.agn.web.entity.user.User;
import com.agn.web.entity.subject.LessonType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_grades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Grade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;  // Кто выставил оценку
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GradeType type; // CURRENT, MIDTERM, etc.
    
    @Enumerated(EnumType.STRING)
    @Column(name = "lesson_type", length = 20)
    private LessonType lessonType; // LECTURE, SEMINAR, etc.
    
    @Column(nullable = false)
    private Integer value;  // 1 - 10
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(length = 500)
    private String comment;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDate.now();  // По умолчанию сегодня
        }
    }
}
