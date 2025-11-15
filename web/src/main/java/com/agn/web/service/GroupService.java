package com.agn.web.service;

import com.agn.web.entity.GroupDTO;

import java.util.List;
import java.util.Optional;

public interface GroupService {
    List<GroupDTO> getAllGroups();
    GroupDTO saveGroup(GroupDTO group);
    GroupDTO getGroupById(Long id);
    void deleteGroup(Long id);
    Optional<GroupDTO> findByName(String name);
}
