package com.devvault.devvault_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueDto {
    private String id;
    private String title;
    private String description;
    private String difficulty;
    private Integer reward;
    private String repository;
    private List<String> labels;
    private Boolean claimed;
    private String claimedBy;
    private String url;
    private LocalDateTime createdAt;
}