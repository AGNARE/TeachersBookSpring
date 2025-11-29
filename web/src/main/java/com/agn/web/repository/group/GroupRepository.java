package com.agn.web.repository.group;

import com.agn.web.entity.group.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByName(String name);
    
    /**
     * Найти все группы, назначенные конкретному преподавателю через DisciplineGroup.
     * @param teacherId ID преподавателя
     * @return список уникальных групп
     */
    @Query("SELECT DISTINCT dg.group FROM DisciplineGroup dg WHERE dg.teacher.id = :teacherId")
    List<Group> findByTeacherId(@Param("teacherId") Long teacherId);
}