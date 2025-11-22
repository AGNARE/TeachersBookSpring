package com.agn.web.service;

import com.agn.web.dto.UserDTO;
import com.agn.web.entity.User;
import com.agn.web.repository.UserRepository;
import com.agn.web.util.CredentialsGenerator;
import com.agn.web.util.CredentialsGenerator.GeneratedCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // Если логин или пароль не заданы – генерируем их из ФИО
        if (isBlank(userDTO.getUsername()) || isBlank(userDTO.getPassword())) {
            GeneratedCredentials creds = generateCredentials(userDTO.getFirstName(), userDTO.getLastName());
            userDTO.setGeneratedUsername(creds.getUsername());
            userDTO.setGeneratedPassword(creds.getPassword());
            userDTO.setUsername(creds.getUsername());
            userDTO.setPassword(creds.getPassword());
        }
        // Создаём сущность User
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : com.agn.web.entity.Role.ADMIN);
        userRepository.save(user);
        return userDTO;
    }

    @Override
    public GeneratedCredentials generateCredentials(String firstName, String lastName) {
        return CredentialsGenerator.generate(firstName, lastName);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
