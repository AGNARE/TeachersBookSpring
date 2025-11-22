package com.agn.web.controller;

import com.agn.web.dto.UserDTO;
import com.agn.web.repository.UserRepository;
import com.agn.web.util.CredentialsGenerator.GeneratedCredentials;
import java.util.List;
import com.agn.web.entity.User;

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getTeachers() {
        List<User> teachers = userRepository.findByRole(com.agn.web.entity.Role.TEACHER);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        List<User> students = userRepository.findByRole(com.agn.web.entity.Role.STUDENT);
        return ResponseEntity.ok(students);
    }
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Generate username and raw password based on firstName and lastName.
     * This endpoint can be used by the admin UI to preview credentials before creating the user.
     */
    @PostMapping("/generate-credentials")
    public ResponseEntity<GeneratedCredentials> generateCredentials(@RequestBody UserDTO request) {
        GeneratedCredentials creds = userService.generateCredentials(request.getFirstName(), request.getLastName());
        return ResponseEntity.ok(creds);
    }

    /**
     * Create a new user. If username/password are missing, they will be generated automatically.
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO created = userService.createUser(userDTO);
        return ResponseEntity.ok(created);
    }
}
