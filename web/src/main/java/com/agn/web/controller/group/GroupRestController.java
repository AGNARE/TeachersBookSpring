package com.agn.web.controller.group;

import com.agn.web.dto.GroupDeletionInfoDTO;
import com.agn.web.entity.group.Group;
import com.agn.web.service.group.GroupService;
import com.agn.web.service.user.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupRestController {

    private final GroupService groupService;
    private final UserContextService userContextService;

    @GetMapping
    public List<Group> getAllGroups() {
        // ADMIN видит все группы, TEACHER - только свои
        if (userContextService.isAdmin()) {
            return groupService.getAllGroups();
        } else {
            return groupService.getGroupsForTeacher(userContextService.getCurrentUserId());
        }
    }

    @PostMapping
    public Group createGroup(@RequestBody Group group) {
        return groupService.saveGroup(group);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(groupService.getGroupById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Получить информацию о том, что будет удалено вместе с группой.
     * @param id ID группы
     * @return информация об удалении
     */
    @GetMapping("/{id}/deletion-info")
    public ResponseEntity<GroupDeletionInfoDTO> getDeletionInfo(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(groupService.getDeletionInfo(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }
}
