package com.agn.web.service.group;

import com.agn.web.dto.GroupDeletionInfoDTO;
import com.agn.web.entity.group.Group;

import java.util.List;
import java.util.Optional;

public interface GroupService {
    List<Group> getAllGroups();
    Group saveGroup(Group group);
    Group getGroupById(Long id);
    void deleteGroup(Long id);
    Optional<Group> findByName(String name);
    
    /**
     * Получить информацию об удалении группы.
     * @param teacherId ID преподавателя
     * @return список групп
     */
    List<Group> getGroupsForTeacher(Long teacherId);
    
    /**
     * Получить информацию о том, что будет удалено вместе с группой.
     * @param id ID группы
     * @return информация об удалении
     */
    GroupDeletionInfoDTO getDeletionInfo(Long id);
}
