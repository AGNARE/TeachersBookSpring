package com.agn.web.service.subject;

import com.agn.web.entity.subject.DisciplineGroup;
import com.agn.web.entity.group.Group;
import com.agn.web.entity.subject.Subject;
import com.agn.web.entity.user.User;
import com.agn.web.repository.subject.DisciplineGroupRepository;
import com.agn.web.repository.group.GroupRepository;
import com.agn.web.repository.subject.SubjectRepository;
import com.agn.web.repository.user.UserRepository;
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
                .orElseThrow(() -> new RuntimeException("DisciplineGroup not found with id: " + id));
    }

    @Override
    @Transactional
    public DisciplineGroup saveDisciplineGroup(DisciplineGroup disciplineGroup) {
        return disciplineGroupRepository.save(disciplineGroup);
    }

    @Override
    @Transactional
    public void deleteDisciplineGroup(Long id) {
        if (!disciplineGroupRepository.existsById(id)) {
            throw new RuntimeException("DisciplineGroup not found with id: " + id);
        }
        disciplineGroupRepository.deleteById(id);
    }
}
