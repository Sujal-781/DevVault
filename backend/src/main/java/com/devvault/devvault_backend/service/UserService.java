package com.devvault.devvault_backend.service;

import com.devvault.devvault_backend.dto.RegisterRequest;
import com.devvault.devvault_backend.dto.UserDto;
import com.devvault.devvault_backend.exception.ResourceNotFoundException;
import com.devvault.devvault_backend.exception.UserAlreadyExistsException;
import com.devvault.devvault_backend.model.User;
import com.devvault.devvault_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(RegisterRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .githubUsername(request.getGithubUsername())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional
    public User updateUserStats(Long userId, int xpGained) {
        User user = findById(userId);
        user.setXp(user.getXp() + xpGained);
        user.setCompletedIssues(user.getCompletedIssues() + 1);
        user.setReputation(user.getReputation() + (xpGained / 10)); // Simple reputation calculation

        return userRepository.save(user);
    }

    @Transactional
    public User incrementClaimedIssues(Long userId) {
        User user = findById(userId);
        user.setClaimedIssues(user.getClaimedIssues() + 1);
        return userRepository.save(user);
    }

    @Transactional
    public User decrementClaimedIssues(Long userId) {
        User user = findById(userId);
        user.setClaimedIssues(Math.max(0, user.getClaimedIssues() - 1));
        return userRepository.save(user);
    }

    public UserDto convertToDto(User user) {
        return UserDto.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().charAt(0) + user.getRole().name().substring(1).toLowerCase())
                .claimedIssues(user.getClaimedIssues())
                .completedIssues(user.getCompletedIssues())
                .totalXP(user.getXp())
                .reputation(user.getReputation())
                .githubUsername(user.getGithubUsername())
                .avatar(user.getAvatar())
                .build();
    }
}