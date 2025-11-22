package com.agn.web.service;

import com.agn.web.entity.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudents();
    Student saveStudent(Student student);
    Student getStudentById(Long id);
    void deleteStudent(Long id);
    Student updateStudent(Long id, Student studentDetails);
    List<Student> getStudentsByGroupId(Long groupId);
}