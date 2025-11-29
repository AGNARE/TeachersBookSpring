package com.agn.web.repository.schedule;

import com.agn.web.entity.schedule.ScheduleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleItemRepository extends JpaRepository<ScheduleItem, Long> {
    List<ScheduleItem> findByDate(LocalDate date);
    
    /**
     * Найти все элементы расписания, которые содержат указанную группу.
     * @param groupId ID группы
     * @return список элементов расписания
     */
    @Query("SELECT si FROM ScheduleItem si JOIN si.groups g WHERE g.id = :groupId")
    List<ScheduleItem> findByGroupId(@Param("groupId") Long groupId);
    
    /**
     * Найти все элементы расписания для указанного предмета.
     * @param subjectId ID предмета
     * @return список элементов расписания
     */
    List<ScheduleItem> findBySubjectId(Long subjectId);
}
