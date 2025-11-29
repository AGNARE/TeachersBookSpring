package com.agn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для информации об удалении дисциплины.
 * Содержит количество связанных объектов, которые будут удалены вместе с дисциплиной.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDeletionInfoDTO {
    
    /**
     * ID дисциплины
     */
    private Long subjectId;
    
    /**
     * Название дисциплины
     */
    private String subjectName;
    
    /**
     * Количество элементов расписания, которые будут удалены
     */
    private int scheduleItemsCount;
    
    /**
     * Количество назначений групп (DisciplineGroup), которые будут удалены
     */
    private int disciplineGroupsCount;
    
    /**
     * Можно ли удалить дисциплину
     */
    private boolean canDelete;
    
    /**
     * Сообщение об ошибке, если удаление невозможно
     */
    private String errorMessage;
}
