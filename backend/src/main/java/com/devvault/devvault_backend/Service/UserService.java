package com.devvault.devvault_backend.Service;

import com.devvault.devvault_backend.model.user;
import com.devvault.devvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<user> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public user saveUser(user user) {
        return userRepository.save(user);
    }
}
