package com.agn.web.controller;

import com.agn.web.entity.StudentDTO;
import com.agn.web.service.GroupService;
import com.agn.web.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final GroupService groupService;

    @GetMapping("/students")
    public String showStudents(Model model) {
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("groups", groupService.getAllGroups()); // <- добавили
        return "students";
    }

    @GetMapping("/students/create")
    public String showCreateForm(Model model) {
        model.addAttribute("student", new StudentDTO());
        model.addAttribute("groups", groupService.getAllGroups());
        return "create-student";
    }

    @PostMapping("/students")
    public String createStudent(@ModelAttribute StudentDTO student) {

        if (student.getGroup() != null && student.getGroup().getId() != null) {
            student.setGroup(groupService.getGroupById(student.getGroup().getId()));
        } else {
            student.setGroup(null);
        }
        studentService.saveStudent(student);
        return "redirect:/students";
    }

    @GetMapping("/students/delete/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return "redirect:/students";
    }

    @GetMapping("/students/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        model.addAttribute("groups", groupService.getAllGroups());
        return "edit-student";
    }

    @PostMapping("/students/update/{id}")
    public String updateStudent(@PathVariable Long id, @ModelAttribute StudentDTO student) {
        if (student.getGroup() != null && student.getGroup().getId() != null) {
            student.setGroup(groupService.getGroupById(student.getGroup().getId()));
        } else {
            student.setGroup(null);
        }

        studentService.updateStudent(id, student);
        return "redirect:/students";
    }
}
