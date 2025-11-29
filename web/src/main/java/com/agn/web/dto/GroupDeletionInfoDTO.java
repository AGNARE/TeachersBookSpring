package com.agn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для информации об удалении группы.
 * Содержит количество связанных объектов, которые будут удалены вместе с группой.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDeletionInfoDTO {
    
    /**
     * ID группы
     */
    private Long groupId;
    
    /**
     * Название группы
     */
    private String groupName;
    
    /**
     * Количество элементов расписания, которые будут удалены
     */
    private int scheduleItemsCount;
    
    /**
     * Количество студентов, которые будут удалены
     */
    private int studentsCount;
    
    /**
     * Количество назначений дисциплин (DisciplineGroup), которые будут удалены
     */
    private int disciplineGroupsCount;
    
    /**
     * Можно ли удалить группу
     */
    private boolean canDelete;
    
    /**
     * Сообщение об ошибке, если удаление невозможно
     */
    private String errorMessage;
}
