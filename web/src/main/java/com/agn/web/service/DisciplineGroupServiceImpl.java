package com.agn.web.service;

import com.agn.web.entity.DisciplineGroup;
import com.agn.web.entity.User;
import com.agn.web.repository.DisciplineGroupRepository;
import com.agn.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplineGroupServiceImpl implements DisciplineGroupService {

    private final DisciplineGroupRepository disciplineGroupRepository;
    private final UserRepository userRepository;

    @Override
    public List<DisciplineGroup> getAllDisciplineGroups() {
        return disciplineGroupRepository.findAll();
    }

    @Override
    public List<DisciplineGroup> getDisciplineGroupsByTeacher(Long teacherId) {
        return disciplineGroupRepository.findByTeacherId(teacherId);
    }

    @Override
    public List<DisciplineGroup> getDisciplineGroupsByGroup(Long groupId) {
        return disciplineGroupRepository.findByGroupId(groupId);
    }

    @Override
    public DisciplineGroup getDisciplineGroupById(Long id) {
        return disciplineGroupRepository.findById(id)

    @Override
    @Transactional
    public void deleteDisciplineGroup(Long id) {
        if (!disciplineGroupRepository.existsById(id)) {
            throw new RuntimeException("DisciplineGroup not found with id: " + id);
        }
        disciplineGroupRepository.deleteById(id);
    }
}
