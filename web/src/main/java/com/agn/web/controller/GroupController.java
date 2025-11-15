package com.agn.web.controller;

import com.agn.web.entity.GroupDTO;
import com.agn.web.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public String showGroups(Model model) {
        model.addAttribute("groups", groupService.getAllGroups());
        return "groups";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("group", new GroupDTO());
        return "create-group";
    }

    @PostMapping
    public String createGroup(@ModelAttribute GroupDTO group) {
        groupService.saveGroup(group);
        return "redirect:/groups";
    }

    @GetMapping("/delete/{id}")
    public String deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return "redirect:/groups";
    }
}
