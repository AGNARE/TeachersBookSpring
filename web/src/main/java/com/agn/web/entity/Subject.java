package com.agn.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;  // Полное название

    @Column(nullable = false)
    private String shortName;  // Краткое название (ОФС, ПАСД)

    @Column(length = 1000)
    private String description;
    
    @Column
    private Integer credits;  // Кредиты/часы
    
    // Cascade delete: при удалении дисциплины удаляются все назначения
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DisciplineGroup> disciplineGroups = new ArrayList<>();
}
