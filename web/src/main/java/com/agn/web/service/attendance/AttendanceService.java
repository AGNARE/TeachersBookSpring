package com.agn.web.service.attendance;

import com.agn.web.entity.attendance.Attendance;

import java.util.List;
import java.util.Map;

public interface AttendanceService {
    
    List<Attendance> getAllAttendance();
    
    Attendance getAttendanceById(Long id);
    
    Attendance saveAttendance(Attendance attendance);
    
    void deleteAttendance(Long id);
    
    List<Attendance> getAttendanceByStudent(Long studentId);
    
    List<Attendance> getAttendanceBySubject(Long subjectId);
    
    List<Attendance> getAttendanceByStudentAndSubject(Long studentId, Long subjectId);
    
    Map<String, Object> getStudentStatistics(Long studentId);
}
