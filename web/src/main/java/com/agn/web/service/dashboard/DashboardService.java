package com.agn.web.service.dashboard;

import com.agn.web.dto.DashboardStatsDTO;
import com.agn.web.repository.group.GroupRepository;
import com.agn.web.repository.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;

    public DashboardStatsDTO getStats() {
        long totalStudents = studentRepository.count();
        long totalGroups = groupRepository.count();

        // Временно отключено, пока нет данных об оценках
        double averageGrade = 0.0;
        long lessonsToday = 0;

        return new DashboardStatsDTO(
                totalStudents,
                totalGroups,
                averageGrade,
                lessonsToday,
                List.of() // Пустой список уроков пока
        );
    }
}
