package com.agn.web.controller.grade;

import com.agn.web.entity.grade.Grade;
import com.agn.web.service.grade.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {
    
    private final GradeService gradeService;
    
    @GetMapping
    public ResponseEntity<List<Grade>> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAllGrades());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.getGradeById(id));
    }
    
    @PostMapping
    public ResponseEntity<Grade> createGrade(@RequestBody Grade grade) {
        return ResponseEntity.ok(gradeService.saveGrade(grade));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestBody Grade grade) {
        grade.setId(id);
        return ResponseEntity.ok(gradeService.saveGrade(grade));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Grade>> getStudentGrades(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getGradesByStudent(studentId));
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Grade>> getSubjectGrades(@PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.getGradesBySubject(subjectId));
    }
    
    @GetMapping("/statistics/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentStatistics(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getStudentStatistics(studentId));
    }
}
