package com.devvault.devvault_backend.dto;

import com.devvault.devvault_backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private Integer claimedIssues;
    private Integer completedIssues;
    private Integer totalXP;
    private Integer reputation;
    private String githubUsername;
    private String avatar;
}