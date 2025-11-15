package com.agn.web.service;

import com.agn.web.entity.GroupDTO;
import com.agn.web.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    @Override
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAll();  // ← теперь список реально из БД
    }

    @Override
    public GroupDTO saveGroup(GroupDTO group) {
        return groupRepository.save(group);  // ← теперь сохраняем в БД
    }

    @Override
    public GroupDTO getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Группа не найдена"));
    }

    @Override
    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

    @Override
    public Optional<GroupDTO> findByName(String name) {
        return groupRepository.findByName(name);
    }
}
