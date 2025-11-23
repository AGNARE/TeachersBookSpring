package com.agn.web.service.student;

import com.agn.web.entity.student.Student;
import com.agn.web.repository.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService{

    private final StudentRepository studentRepository;


    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Student getStudentById(Long id) {
            return studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Студент не найден"));
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setMiddleName(studentDetails.getMiddleName());
        student.setDateBorn(studentDetails.getDateBorn());
        student.setGroup(studentDetails.getGroup());
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getStudentsByGroupId(Long groupId) {
        // TODO: Реализовать метод в репозитории, если нужно фильтровать по группе
        // Пока возвращаем всех (или нужно добавить метод в репозиторий)
        return studentRepository.findAll().stream()
                .filter(s -> s.getGroup() != null && s.getGroup().getId().equals(groupId))
                .toList();
    }
}
