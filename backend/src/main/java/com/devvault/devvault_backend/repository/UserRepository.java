package com.devvault.devvault_backend.repository;

import com.devvault.devvault_backend.model.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<user, Long> {
    Optional<user> findByEmail(String email);
    boolean existsByEmail(String email);
}
