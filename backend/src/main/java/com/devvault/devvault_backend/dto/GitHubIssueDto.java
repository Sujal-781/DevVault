package com.devvault.devvault_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GitHubIssueDto {
    private Long id;
    private String title;
    private String body;
    private String state;

    @JsonProperty("html_url")
    private String htmlUrl;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    private List<Label> labels;
    private Repository repository;
    private User user;

    @Data
    public static class Label {
        private String name;
        private String color;
    }

    @Data
    public static class Repository {
        private String name;

        @JsonProperty("full_name")
        private String fullName;

        private Owner owner;
    }

    @Data
    public static class Owner {
        private String login;
    }

    @Data
    public static class User {
        private String login;

        @JsonProperty("avatar_url")
        private String avatarUrl;
    }
}