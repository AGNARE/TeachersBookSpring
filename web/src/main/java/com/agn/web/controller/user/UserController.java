package com.agn.web.controller.user;

import com.agn.web.dto.UserDTO;
import com.agn.web.entity.user.User;
import com.agn.web.repository.user.UserRepository;
import com.agn.web.service.user.UserService;
import com.agn.web.util.CredentialsGenerator.GeneratedCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    /**
     * Получить всех пользователей.
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

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

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getTeachers() {
        List<User> teachers = userRepository.findByRole(com.agn.web.entity.user.Role.TEACHER);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        List<User> students = userRepository.findByRole(com.agn.web.entity.user.Role.STUDENT);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAdmins() {
        List<User> admins = userRepository.findByRole(com.agn.web.entity.user.Role.ADMIN);
        return ResponseEntity.ok(admins);
    }
}
