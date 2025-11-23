package com.agn.web.service.subject;

import com.agn.web.entity.subject.Subject;

import java.util.List;

public interface SubjectService {
    List<Subject> getAllSubjects();
    Subject getSubjectById(Long id);
    Subject saveSubject(Subject subject);
    void deleteSubject(Long id);
}
