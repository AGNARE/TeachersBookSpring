package com.agn.web.service;


import com.agn.web.entity.StudentDTO;
import com.agn.web.repository.GroupRepository;
import com.agn.web.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService{

    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;


    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public StudentDTO saveStudent(StudentDTO student) {
        return studentRepository.save(student);
    }

    @Override
    public StudentDTO getStudentById(Long id) {
            return studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDetails) {
        StudentDTO student = getStudentById(id);
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setMiddleName(studentDetails.getMiddleName());
        student.setDateBorn(studentDetails.getDateBorn());
        student.setGroup(studentDetails.getGroup());
        return studentRepository.save(student);
    }
}
