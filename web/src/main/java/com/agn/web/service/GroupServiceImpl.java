package com.agn.web.service;

import com.agn.web.entity.Group;
import com.agn.web.repository.GroupRepository;
import com.agn.web.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final StudentRepository studentRepository;

    @Override
    public List<Group> getAllGroups() {
        return groupRepository.findAll();  // ← теперь список реально из БД
    }

    @Override
    public Group saveGroup(Group group) {
        return groupRepository.save(group);  // ← теперь сохраняем в БД
    }

    @Override
    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Группа не найдена"));
    }

    @Override
    @Transactional
    public void deleteGroup(Long id) {
        // Проверяем существование группы
        if (!groupRepository.existsById(id)) {
            throw new RuntimeException("Group not found");
        }
        
        // Находим всех студентов в этой группе через специальный метод
        List<com.agn.web.entity.Student> studentsInGroup = studentRepository.findByGroupId(id);
        
        // Удаляем студентов
        if (!studentsInGroup.isEmpty()) {
            studentRepository.deleteAll(studentsInGroup);
        }
        
        // Теперь можно безопасно удалить группу
        groupRepository.deleteById(id);
    }

    @Override
    public Optional<Group> findByName(String name) {
        return groupRepository.findByName(name);
    }
}
