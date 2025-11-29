package com.agn.web.service.user;

import com.agn.web.dto.UserDTO;
import com.agn.web.entity.user.User;
import com.agn.web.repository.user.UserRepository;
import com.agn.web.util.CredentialsGenerator;
import com.agn.web.util.CredentialsGenerator.GeneratedCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // Если логин или пароль не заданы – генерируем их из ФИО
        String rawPassword;
        if (isBlank(userDTO.getUsername()) || isBlank(userDTO.getPassword())) {
            GeneratedCredentials creds = generateCredentials(userDTO.getFirstName(), userDTO.getLastName());
            userDTO.setGeneratedUsername(creds.getUsername());
            userDTO.setGeneratedPassword(creds.getPassword());
            userDTO.setUsername(creds.getUsername());
            userDTO.setPassword(creds.getPassword());
            rawPassword = creds.getPassword();
        } else {
            rawPassword = userDTO.getPassword();
        }
        
        // Создаём сущность User
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(rawPassword));  // Хешируем пароль
        user.setPlainPassword(rawPassword);  // Сохраняем исходный пароль
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : com.agn.web.entity.user.Role.ADMIN);
        userRepository.save(user);
        return userDTO;
    }

    @Override
    public GeneratedCredentials generateCredentials(String firstName, String lastName) {
        return CredentialsGenerator.generate(firstName, lastName);
    }
    
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
