package com.agn.web.controller;

import com.agn.web.service.GroupService;
import com.agn.web.service.StudentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private final StudentService studentService;
    private final GroupService groupService;

    public DashboardController(StudentService studentService, GroupService groupService) {
        this.studentService = studentService;
        this.groupService = groupService;
    }

    @GetMapping({"/", "/dashboard"})
    public String showDashboard(Model model) {
        model.addAttribute("totalStudents", studentService.getAllStudents().size());
        model.addAttribute("totalGroups", groupService.getAllGroups().size());
        model.addAttribute("studentsWithoutGroup",
                studentService.getAllStudents().stream().filter(s -> s.getGroup() == null).count());
        model.addAttribute("latestStudents",
                studentService.getAllStudents().stream()
                        .sorted((a,b) -> b.getId().compareTo(a.getId()))
                        .limit(5).toList());
        return "dashboard"; // имя Thymeleaf-шаблона
    }
}