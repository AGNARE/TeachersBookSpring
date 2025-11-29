package com.agn.web.service.grade;

import com.agn.web.entity.grade.Grade;
import com.agn.web.repository.grade.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {
    
    private final GradeRepository gradeRepository;
    
    @Override
    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }
    
    @Override
    public Grade getGradeById(Long id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found with id: " + id));
    }
    
    @Override
    @Transactional
    public Grade saveGrade(Grade grade) {
        return gradeRepository.save(grade);
    }
    
    @Override
    @Transactional
    public void deleteGrade(Long id) {
        if (!gradeRepository.existsById(id)) {
            throw new RuntimeException("Grade not found with id: " + id);
        }
        gradeRepository.deleteById(id);
    }
    
    @Override
    public List<Grade> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }
    
    @Override
    public List<Grade> getGradesBySubject(Long subjectId) {
        return gradeRepository.findBySubjectId(subjectId);
    }
    
    @Override
    public List<Grade> getGradesByStudentAndSubject(Long studentId, Long subjectId) {
        return gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId);
    }
    
    @Override
    public Double getAverageGrade(Long studentId) {
        Double avg = gradeRepository.findAverageByStudentId(studentId);
        return avg != null ? avg : 0.0;
    }
    
    @Override
    public Double getAverageGradeBySubject(Long studentId, Long subjectId) {
        Double avg = gradeRepository.findAverageByStudentIdAndSubjectId(studentId, subjectId);
        return avg != null ? avg : 0.0;
    }
    
    @Override
    public Map<String, Object> getStudentStatistics(Long studentId) {
        List<Grade> grades = getGradesByStudent(studentId);
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalGrades", grades.size());
        stats.put("averageGrade", getAverageGrade(studentId));
        stats.put("grades", grades);
        
        return stats;
    }
}
