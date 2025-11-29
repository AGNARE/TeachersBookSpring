package com.agn.web.controller.subject;

import com.agn.web.dto.SubjectDeletionInfoDTO;
import com.agn.web.entity.subject.Subject;
import com.agn.web.service.subject.SubjectService;
import com.agn.web.service.user.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;
    private final UserContextService userContextService;

    @GetMapping
    public List<Subject> getAllSubjects() {
        // ADMIN видит все дисциплины, TEACHER - только свои
        if (userContextService.isAdmin()) {
            return subjectService.getAllSubjects();
        } else {
            return subjectService.getSubjectsForTeacher(userContextService.getCurrentUserId());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(subjectService.getSubjectById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Subject createSubject(@RequestBody Subject subject) {
        return subjectService.saveSubject(subject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        try {
            subject.setId(id);
            return ResponseEntity.ok(subjectService.saveSubject(subject));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Получить информацию о том, что будет удалено вместе с дисциплиной.
     * @param id ID дисциплины
     * @return информация об удалении
     */
    @GetMapping("/{id}/deletion-info")
    public ResponseEntity<SubjectDeletionInfoDTO> getDeletionInfo(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(subjectService.getDeletionInfo(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        try {
            subjectService.deleteSubject(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
