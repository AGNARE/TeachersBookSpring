package com.agn.web.repository.subject;

import com.agn.web.entity.subject.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
    
    /**
     * Найти все дисциплины, назначенные конкретному преподавателю через DisciplineGroup.
     * @param teacherId ID преподавателя
     * @return список уникальных дисциплин
     */
    @Query("SELECT DISTINCT dg.subject FROM DisciplineGroup dg WHERE dg.teacher.id = :teacherId")
    List<Subject> findByTeacherId(@Param("teacherId") Long teacherId);
}
