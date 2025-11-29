package com.agn.web.service.grade;

import com.agn.web.entity.grade.Grade;

import java.util.List;
import java.util.Map;

public interface GradeService {
    
    List<Grade> getAllGrades();
    
    Grade getGradeById(Long id);
    
    Grade saveGrade(Grade grade);
    
    void deleteGrade(Long id);
    
    List<Grade> getGradesByStudent(Long studentId);
    
    List<Grade> getGradesBySubject(Long subjectId);
    
    List<Grade> getGradesByStudentAndSubject(Long studentId, Long subjectId);
    
    Double getAverageGrade(Long studentId);
    
    Double getAverageGradeBySubject(Long studentId, Long subjectId);
    
    Map<String, Object> getStudentStatistics(Long studentId);
}
