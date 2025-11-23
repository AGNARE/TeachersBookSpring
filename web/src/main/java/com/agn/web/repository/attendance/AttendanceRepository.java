package com.agn.web.repository.attendance;

import com.agn.web.entity.attendance.Attendance;
import com.agn.web.entity.attendance.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByStudentId(Long studentId);
    
    List<Attendance> findBySubjectId(Long subjectId);
    
    List<Attendance> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    Long countPresentByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    Long countTotalByStudentId(@Param("studentId") Long studentId);
}
