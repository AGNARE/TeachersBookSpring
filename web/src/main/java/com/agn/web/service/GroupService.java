package com.agn.web.service;

import com.agn.web.entity.Group;

import java.util.List;
import java.util.Optional;

public interface GroupService {
    List<Group> getAllGroups();
    Group saveGroup(Group group);
    Group getGroupById(Long id);
    void deleteGroup(Long id);
    Optional<Group> findByName(String name);
}
