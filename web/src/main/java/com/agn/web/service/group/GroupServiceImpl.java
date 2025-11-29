package com.agn.web.service.group;

import com.agn.web.dto.GroupDeletionInfoDTO;
import com.agn.web.entity.group.Group;
import com.agn.web.entity.schedule.ScheduleItem;
import com.agn.web.entity.student.Student;
import com.agn.web.repository.group.GroupRepository;
import com.agn.web.repository.schedule.ScheduleItemRepository;
import com.agn.web.repository.student.StudentRepository;
import com.agn.web.repository.subject.DisciplineGroupRepository;
import jakarta.persistence.EntityManager;
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
    private final ScheduleItemRepository scheduleItemRepository;
    private final DisciplineGroupRepository disciplineGroupRepository;
    private final EntityManager entityManager;

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
        
        // 1. Сначала удаляем все элементы расписания, связанные с этой группой
        List<ScheduleItem> scheduleItems = scheduleItemRepository.findByGroupId(id);
        if (!scheduleItems.isEmpty()) {
            scheduleItemRepository.deleteAll(scheduleItems);
            entityManager.flush();  // Принудительно выполнить удаление
        }
        
        // 2. Удаляем назначения DisciplineGroup
        List<com.agn.web.entity.subject.DisciplineGroup> disciplineGroups = disciplineGroupRepository.findByGroupId(id);
        if (!disciplineGroups.isEmpty()) {
            disciplineGroupRepository.deleteAll(disciplineGroups);
            entityManager.flush();  // Принудительно выполнить удаление
        }
        
        // 3. Находим всех студентов в этой группе
        List<Student> studentsInGroup = studentRepository.findByGroupId(id);
        
        // 4. Удаляем студентов
        if (!studentsInGroup.isEmpty()) {
            studentRepository.deleteAll(studentsInGroup);
            entityManager.flush();  // Принудительно выполнить удаление
        }
        
        // 5. Теперь можно безопасно удалить группу
        groupRepository.deleteById(id);
    }

    @Override
    public Optional<Group> findByName(String name) {
        return groupRepository.findByName(name);
    }

    @Override
    public List<Group> getGroupsForTeacher(Long teacherId) {
        return groupRepository.findByTeacherId(teacherId);
    }

    @Override
    public GroupDeletionInfoDTO getDeletionInfo(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Группа не найдена"));
        
        // Подсчитываем связанные объекты
        int scheduleCount = scheduleItemRepository.findByGroupId(id).size();
        int studentsCount = studentRepository.findByGroupId(id).size();
        int disciplineGroupsCount = disciplineGroupRepository.findByGroupId(id).size();
        
        return GroupDeletionInfoDTO.builder()
                .groupId(id)
                .groupName(group.getName())
                .scheduleItemsCount(scheduleCount)
                .studentsCount(studentsCount)
                .disciplineGroupsCount(disciplineGroupsCount)
                .canDelete(true)  // Всегда можно удалить, но с предупреждением
                .build();
    }
}
