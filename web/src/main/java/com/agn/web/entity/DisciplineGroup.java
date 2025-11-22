package com.agn.web.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "discipline_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisciplineGroup {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = true)
    private User teacher;  // Преподаватель, ведущий дисциплину
    
    @Column(nullable = false)
    private Integer semester;  // Семестр (1, 2, 3, ...)
    
    @Column(nullable = false)
    private Integer year;  // Учебный год (2024, 2025)
}
