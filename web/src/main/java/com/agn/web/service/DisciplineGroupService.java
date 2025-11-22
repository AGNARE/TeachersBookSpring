package com.agn.web.service;

import com.agn.web.entity.DisciplineGroup;

import java.util.List;

public interface DisciplineGroupService {
    List<DisciplineGroup> getAllDisciplineGroups();
    List<DisciplineGroup> getDisciplineGroupsByTeacher(Long teacherId);
    List<DisciplineGroup> getDisciplineGroupsByGroup(Long groupId);
    DisciplineGroup getDisciplineGroupById(Long id);
    DisciplineGroup saveDisciplineGroup(DisciplineGroup disciplineGroup);
    void deleteDisciplineGroup(Long id);
}
