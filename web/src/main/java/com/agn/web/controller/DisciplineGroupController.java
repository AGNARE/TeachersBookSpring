package com.agn.web.controller;

import com.agn.web.entity.DisciplineGroup;
import com.agn.web.service.DisciplineGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discipline-groups")
@RequiredArgsConstructor
public class DisciplineGroupController {

    private final DisciplineGroupService disciplineGroupService;

    @GetMapping
    public List<DisciplineGroup> getAllDisciplineGroups() {
        return disciplineGroupService.getAllDisciplineGroups();
    }

    @GetMapping("/teacher/{teacherId}")
    public List<DisciplineGroup> getDisciplineGroupsByTeacher(@PathVariable Long teacherId) {
        return disciplineGroupService.getDisciplineGroupsByTeacher(teacherId);
    }

    @GetMapping("/group/{groupId}")
    public List<DisciplineGroup> getDisciplineGroupsByGroup(@PathVariable Long groupId) {
        return disciplineGroupService.getDisciplineGroupsByGroup(groupId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplineGroup> getDisciplineGroupById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(disciplineGroupService.getDisciplineGroupById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public DisciplineGroup createDisciplineGroup(@RequestBody DisciplineGroup disciplineGroup) {
        return disciplineGroupService.saveDisciplineGroup(disciplineGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisciplineGroup> updateDisciplineGroup(
            @PathVariable Long id,
            @RequestBody DisciplineGroup disciplineGroup) {
        try {
            disciplineGroup.setId(id);
            return ResponseEntity.ok(disciplineGroupService.saveDisciplineGroup(disciplineGroup));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisciplineGroup(@PathVariable Long id) {
        try {
            disciplineGroupService.deleteDisciplineGroup(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
