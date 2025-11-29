package com.agn.web.service.subject;

import com.agn.web.dto.SubjectDeletionInfoDTO;
import com.agn.web.entity.schedule.ScheduleItem;
import com.agn.web.entity.subject.Subject;
import com.agn.web.repository.schedule.ScheduleItemRepository;
import com.agn.web.repository.subject.DisciplineGroupRepository;
import com.agn.web.repository.subject.SubjectRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final ScheduleItemRepository scheduleItemRepository;
    private final DisciplineGroupRepository disciplineGroupRepository;
    private final EntityManager entityManager;

    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }

    @Override
    @Transactional
    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found with id: " + id);
        }
        
        // 1. Сначала удаляем все элементы расписания для этой дисциплины
        List<ScheduleItem> scheduleItems = scheduleItemRepository.findBySubjectId(id);
        if (!scheduleItems.isEmpty()) {
            scheduleItemRepository.deleteAll(scheduleItems);
            entityManager.flush();  // Принудительно выполнить удаление
        }
        
        // 2. Cascade delete автоматически удалит все DisciplineGroup
        subjectRepository.deleteById(id);
    }

    @Override
    public List<Subject> getSubjectsForTeacher(Long teacherId) {
        return subjectRepository.findByTeacherId(teacherId);
    }

    @Override
    public SubjectDeletionInfoDTO getDeletionInfo(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Дисциплина не найдена"));
        
        // Подсчитываем связанные объекты
        int scheduleCount = scheduleItemRepository.findBySubjectId(id).size();
        int disciplineGroupsCount = disciplineGroupRepository.findBySubjectId(id).size();
        
        return SubjectDeletionInfoDTO.builder()
                .subjectId(id)
                .subjectName(subject.getName())
                .scheduleItemsCount(scheduleCount)
                .disciplineGroupsCount(disciplineGroupsCount)
                .canDelete(true)  // Всегда можно удалить, но с предупреждением
                .build();
    }
}
