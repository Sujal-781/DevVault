package com.devvault.devvault_backend.controller;

import com.devvault.devvault_backend.dto.AuthRequest;
import com.devvault.devvault_backend.dto.AuthResponse;
import com.devvault.devvault_backend.model.User;
import com.devvault.devvault_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        if (userService.emailExists(user.getEmail())) {
            return new AuthResponse(null, "Email already exists.");
        }
        userService.saveUser(user);
        return new AuthResponse(null, "User registered successfully.");
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        // For now, no password hashing or token - just basic structure
        return new AuthResponse("dummy-token", "Login successful.");
    }
}
