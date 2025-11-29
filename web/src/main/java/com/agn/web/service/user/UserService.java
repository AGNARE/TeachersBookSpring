package com.agn.web.service.user;

import com.agn.web.dto.UserDTO;
import com.agn.web.entity.user.User;
import com.agn.web.util.CredentialsGenerator.GeneratedCredentials;

import java.util.List;

public interface UserService {
    /**
     * Creates a new user. If username or password are null/empty, they will be generated
     * based on firstName and lastName.
     */
    UserDTO createUser(UserDTO userDTO);

    /**
     * Generates a username and raw password from firstName and lastName.
     */
    GeneratedCredentials generateCredentials(String firstName, String lastName);
    
    /**
     * Get all users.
     */
    List<User> getAllUsers();
    
    /**
     * Get user by ID.
     */
    User getUserById(Long id);
}
