package com.devvault.devvault_backend.service;

import com.devvault.devvault_backend.dto.AuthResponse;
import com.devvault.devvault_backend.dto.LoginRequest;
import com.devvault.devvault_backend.dto.RegisterRequest;
import com.devvault.devvault_backend.dto.UserDto;
import com.devvault.devvault_backend.model.User;
import com.devvault.devvault_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for user: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(user);
        UserDto userDto = userService.convertToDto(user);

        log.info("User {} logged in successfully", request.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(userDto)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        log.info("Attempting registration for user: {}", request.getEmail());

        User user = userService.createUser(request);
        String token = jwtTokenProvider.generateToken(user);
        UserDto userDto = userService.convertToDto(user);

        log.info("User {} registered successfully", request.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(userDto)
                .build();
    }
}