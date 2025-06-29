package com.devvault.devvault_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class user {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private int xp;

    private int reputation;

    private String githubUsername;

    private String avatar;

}
