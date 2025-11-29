package com.agn.web.service.user;

import com.agn.web.entity.user.Role;
import com.agn.web.entity.user.User;
import com.agn.web.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Сервис для получения информации о текущем аутентифицированном пользователе.
 */
@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserRepository userRepository;

    /**
     * Получить текущего аутентифицированного пользователя.
     * @return текущий пользователь
     * @throws RuntimeException если пользователь не найден
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Пользователь не аутентифицирован");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + username));
    }

    /**
     * Получить ID текущего пользователя.
     * @return ID текущего пользователя
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Получить роль текущего пользователя.
     * @return роль текущего пользователя
     */
    public Role getCurrentUserRole() {
        return getCurrentUser().getRole();
    }

    /**
     * Проверить, является ли текущий пользователь администратором.
     * @return true если пользователь - ADMIN, иначе false
     */
    public boolean isAdmin() {
        return getCurrentUserRole() == Role.ADMIN;
    }

    /**
     * Проверить, является ли текущий пользователь преподавателем.
     * @return true если пользователь - TEACHER, иначе false
     */
    public boolean isTeacher() {
        return getCurrentUserRole() == Role.TEACHER;
    }
}
