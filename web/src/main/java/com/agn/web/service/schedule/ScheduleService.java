package com.agn.web.service.schedule;

import com.agn.web.dto.schedule.ScheduleItemDTO;
import com.agn.web.entity.group.Group;
import com.agn.web.entity.schedule.ScheduleItem;
import com.agn.web.entity.subject.Subject;
import com.agn.web.entity.user.User;
import com.agn.web.repository.group.GroupRepository;
import com.agn.web.repository.schedule.ScheduleItemRepository;
import com.agn.web.repository.subject.SubjectRepository;
import com.agn.web.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Validated
public class ScheduleService {

    private final ScheduleItemRepository scheduleItemRepository;
    private final GroupRepository groupRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public List<ScheduleItem> getAll() {
        return scheduleItemRepository.findAll();
    }

    public List<ScheduleItem> getByDate(LocalDate date) {
        return scheduleItemRepository.findByDate(date);
    }

    public ScheduleItem getById(Long id) {
        return scheduleItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScheduleItem not found"));
    }

    /** Convert DTO to entity, fetching related entities by IDs */
    private ScheduleItem fromDTO(ScheduleItemDTO dto) {
        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        Set<Group> groups = dto.getGroupIds().stream()
                .map(groupId -> groupRepository.findById(groupId)
                        .orElseThrow(() -> new RuntimeException("Group not found: " + groupId)))
                .collect(Collectors.toSet());
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found: " + dto.getSubjectId()));
        User teacher = userRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + dto.getTeacherId()));
        return ScheduleItem.builder()
                .id(dto.getId())
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .groups(groups)
                .subject(subject)
                .teacher(teacher)
                .lessonType(dto.getLessonType())
                .build();
    }

    public ScheduleItem create(ScheduleItemDTO dto) {
        return scheduleItemRepository.save(fromDTO(dto));
    }

    public ScheduleItem update(Long id, ScheduleItemDTO dto) {
        dto.setId(id);
        return scheduleItemRepository.save(fromDTO(dto));
    }

    public void delete(Long id) {
        scheduleItemRepository.deleteById(id);
    }
}
