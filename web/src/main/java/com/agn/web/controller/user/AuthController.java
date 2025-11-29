package com.agn.web.controller.user;

import com.agn.web.dto.AuthResponse;
import com.agn.web.dto.LoginRequest;
import com.agn.web.dto.RegisterRequest;
import com.agn.web.entity.user.Role;
import com.agn.web.entity.user.User;
import com.agn.web.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setRole(Role.STUDENT); // Default role для новых пользователей

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("dummy-token", user.getUsername(), user.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username()).orElseThrow();
        // В реальном приложении здесь была бы генерация JWT
        return ResponseEntity.ok(new AuthResponse("dummy-token", user.getUsername(), user.getRole().name()));
    }
}

