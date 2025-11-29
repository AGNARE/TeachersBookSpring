package com.agn.web.service.attendance;

import com.agn.web.entity.attendance.Attendance;
import com.agn.web.entity.attendance.AttendanceStatus;
import com.agn.web.repository.attendance.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    
    @Override
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
    
    @Override
    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found with id: " + id));
    }
    
    @Override
    @Transactional
    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }
    
    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance record not found with id: " + id);
        }
        attendanceRepository.deleteById(id);
    }
    
    @Override
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
    
    @Override
    public List<Attendance> getAttendanceBySubject(Long subjectId) {
        return attendanceRepository.findBySubjectId(subjectId);
    }
    
    @Override
    public List<Attendance> getAttendanceByStudentAndSubject(Long studentId, Long subjectId) {
        return attendanceRepository.findByStudentIdAndSubjectId(studentId, subjectId);
    }
    
    @Override
    public Map<String, Object> getStudentStatistics(Long studentId) {
        Long total = attendanceRepository.countTotalByStudentId(studentId);
        Long present = attendanceRepository.countPresentByStudentId(studentId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClasses", total);
        stats.put("presentClasses", present);
        stats.put("attendancePercentage", total > 0 ? (double) present / total * 100 : 0.0);
        
        return stats;
    }
}
