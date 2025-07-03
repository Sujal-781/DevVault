package com.devvault.devvault_backend.controller;

import com.devvault.devvault_backend.dto.ApiResponse;
import com.devvault.devvault_backend.dto.IssueDto;
import com.devvault.devvault_backend.model.Issue;
import com.devvault.devvault_backend.model.User;
import com.devvault.devvault_backend.service.IssueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IssueDto>>> getAllIssues(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String status) {

        try {
            List<IssueDto> issues;

            if (search != null || difficulty != null || status != null) {
                Issue.Difficulty difficultyEnum = difficulty != null ?
                        Issue.Difficulty.valueOf(difficulty.toUpperCase()) : null;
                Issue.IssueStatus statusEnum = status != null ?
                        Issue.IssueStatus.valueOf(status.toUpperCase()) : null;

                issues = issueService.searchIssues(search, difficultyEnum, statusEnum);
            } else {
                issues = issueService.getAllIssues();
            }

            return ResponseEntity.ok(ApiResponse.success(issues));
        } catch (Exception e) {
            log.error("Error fetching issues", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error fetching issues"));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<IssueDto>>> getAvailableIssues() {
        try {
            List<IssueDto> issues = issueService.getAvailableIssues();
            return ResponseEntity.ok(ApiResponse.success(issues));
        } catch (Exception e) {
            log.error("Error fetching available issues", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error fetching available issues"));
        }
    }

    @GetMapping("/my-issues")
    public ResponseEntity<ApiResponse<List<IssueDto>>> getMyIssues() {
        try {
            User currentUser = getCurrentUser();
            List<IssueDto> issues = issueService.getIssuesByUser(currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success(issues));
        } catch (Exception e) {
            log.error("Error fetching user issues", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error fetching your issues"));
        }
    }

    @PostMapping("/{issueId}/claim")
    public ResponseEntity<ApiResponse<IssueDto>> claimIssue(@PathVariable Long issueId) {
        try {
            User currentUser = getCurrentUser();
            IssueDto issue = issueService.claimIssue(issueId, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Issue claimed successfully", issue));
        } catch (Exception e) {
            log.error("Error claiming issue {}", issueId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{issueId}/unclaim")
    public ResponseEntity<ApiResponse<IssueDto>> unclaimIssue(@PathVariable Long issueId) {
        try {
            User currentUser = getCurrentUser();
            IssueDto issue = issueService.unclaimIssue(issueId, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Issue unclaimed successfully", issue));
        } catch (Exception e) {
            log.error("Error unclaiming issue {}", issueId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{issueId}/complete")
    public ResponseEntity<ApiResponse<IssueDto>> completeIssue(@PathVariable Long issueId) {
        try {
            User currentUser = getCurrentUser();
            IssueDto issue = issueService.completeIssue(issueId, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Issue completed successfully", issue));
        } catch (Exception e) {
            log.error("Error completing issue {}", issueId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}