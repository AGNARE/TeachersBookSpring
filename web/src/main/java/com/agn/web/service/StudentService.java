package com.agn.web.service;

import com.agn.web.entity.StudentDTO;

import java.util.List;

public interface StudentService{
    List<StudentDTO> getAllStudents();
    StudentDTO saveStudent(StudentDTO student);
    StudentDTO getStudentById(Long id);
    void deleteStudent(Long id);
    StudentDTO updateStudent(Long id, StudentDTO studentDetails);
}