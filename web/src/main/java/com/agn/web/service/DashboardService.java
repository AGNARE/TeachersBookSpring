package com.agn.web.service;

import com.agn.web.dto.DashboardStatsDTO;
import com.agn.web.dto.LessonDTO;
import com.agn.web.entity.Lesson;
import com.agn.web.repository.GroupRepository;
import com.agn.web.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;
    // Временно убрали, пока нет таблиц grades и lessons
    // private final GradeRepository gradeRepository;
    // private final LessonRepository lessonRepository;

    public DashboardStatsDTO getStats() {
        long totalStudents = studentRepository.count();
        long totalGroups = groupRepository.count();

        // Временно отключено, пока нет данных об оценках
        double averageGrade = 0.0;
        // Double avgGradeVal = gradeRepository.getAverageGrade();
        // double averageGrade = avgGradeVal != null ? Math.round(avgGradeVal * 10.0) / 10.0 : 0.0;

        // Временно отключено, пока нет данных об уроках
        long lessonsToday = 0;
        // LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        // LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        // long lessonsToday = lessonRepository.countByStartTimeBetween(startOfDay, endOfDay);

        // List<Lesson> upcomingLessons = lessonRepository.findTop3ByStartTimeAfterOrderByStartTimeAsc(LocalDateTime.now());
        // List<LessonDTO> upcomingLessonDTOs = upcomingLessons.stream()
        //         .map(this::mapToLessonDTO)
        //         .collect(Collectors.toList());

        return new DashboardStatsDTO(
                totalStudents,
                totalGroups,
                averageGrade,
                lessonsToday,
                List.of() // Пустой список уроков пока
        );
    }
}
