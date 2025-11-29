package com.agn.web.service.subject;

import com.agn.web.dto.SubjectDeletionInfoDTO;
import com.agn.web.entity.subject.Subject;

import java.util.List;

public interface SubjectService {
    List<Subject> getAllSubjects();
    Subject getSubjectById(Long id);
    Subject saveSubject(Subject subject);
    void deleteSubject(Long id);
    
    /**
     * Получить список дисциплин для конкретного преподавателя.
     * @param teacherId ID преподавателя
     * @return список дисциплин
     */
    List<Subject> getSubjectsForTeacher(Long teacherId);
    
    /**
     * Получить информацию о том, что будет удалено вместе с дисциплиной.
     * @param id ID дисциплины
     * @return информация об удалении
     */
    SubjectDeletionInfoDTO getDeletionInfo(Long id);
}
