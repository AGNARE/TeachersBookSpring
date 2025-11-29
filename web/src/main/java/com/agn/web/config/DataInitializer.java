package com.agn.web.config;

import com.agn.web.entity.user.Role;
import com.agn.web.entity.user.User;
import com.agn.web.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin (Role: ADMIN)");
        }
    }
}

