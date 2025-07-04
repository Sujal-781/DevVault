package com.devvault.devvault_backend.controller;

import com.devvault.devvault_backend.dto.ApiResponse;
import com.devvault.devvault_backend.service.GitHubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final GitHubService gitHubService;

    @PostMapping("/sync-github-issues")
    @PreAuthorize("hasRole('MAINTAINER')")
    public ResponseEntity<ApiResponse<String>> syncGitHubIssues() {
        try {
            log.info("Starting GitHub issues synchronization");
            gitHubService.syncIssuesFromGitHub();
            return ResponseEntity.ok(ApiResponse.success("GitHub issues synchronized successfully"));
        } catch (Exception e) {
            log.error("Error synchronizing GitHub issues", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error synchronizing GitHub issues: " + e.getMessage()));
        }
    }
}