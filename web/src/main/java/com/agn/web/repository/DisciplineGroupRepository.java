package com.agn.web.repository;

import com.agn.web.entity.DisciplineGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplineGroupRepository extends JpaRepository<DisciplineGroup, Long> {
    List<DisciplineGroup> findByTeacherId(Long teacherId);
    List<DisciplineGroup> findByGroupId(Long groupId);
    List<DisciplineGroup> findBySubjectId(Long subjectId);
}
