package com.devvault.devvault_backend.service;

import com.devvault.devvault_backend.dto.IssueDto;
import com.devvault.devvault_backend.exception.IssueAlreadyClaimedException;
import com.devvault.devvault_backend.exception.ResourceNotFoundException;
import com.devvault.devvault_backend.model.Issue;
import com.devvault.devvault_backend.model.User;
import com.devvault.devvault_backend.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserService userService;

    public List<IssueDto> getAllIssues() {
        log.info("Fetching all issues");
        List<Issue> issues = issueRepository.findAll();
        return issues.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<IssueDto> getAvailableIssues() {
        log.info("Fetching available issues");
        List<Issue> issues = issueRepository.findAvailableIssues(Issue.IssueStatus.OPEN);
        return issues.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<IssueDto> getIssuesByUser(Long userId) {
        log.info("Fetching issues for user ID: {}", userId);
        User user = userService.findById(userId);
        List<Issue> issues = issueRepository.findByClaimedBy(user);
        return issues.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<IssueDto> searchIssues(String searchTerm, Issue.Difficulty difficulty, Issue.IssueStatus status) {
        log.info("Searching issues with term: {}, difficulty: {}, status: {}", searchTerm, difficulty, status);
        List<Issue> issues = issueRepository.findIssuesWithFilters(
                searchTerm != null ? searchTerm : "",
                difficulty,
                status
        );
        return issues.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public IssueDto claimIssue(Long issueId, Long userId) {
        log.info("User {} attempting to claim issue {}", userId, issueId);

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + issueId));

        if (issue.getClaimedBy() != null) {
            throw new IssueAlreadyClaimedException("Issue is already claimed by another user");
        }

        User user = userService.findById(userId);

        issue.setClaimedBy(user);
        issue.setStatus(Issue.IssueStatus.CLAIMED);
        issue.setClaimedAt(LocalDateTime.now());

        Issue savedIssue = issueRepository.save(issue);
        userService.incrementClaimedIssues(userId);

        log.info("Issue {} successfully claimed by user {}", issueId, userId);
        return convertToDto(savedIssue);
    }

    @Transactional
    public IssueDto unclaimIssue(Long issueId, Long userId) {
        log.info("User {} attempting to unclaim issue {}", userId, issueId);

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + issueId));

        if (issue.getClaimedBy() == null || !issue.getClaimedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only unclaim issues that you have claimed");
        }

        issue.setClaimedBy(null);
        issue.setStatus(Issue.IssueStatus.OPEN);
        issue.setClaimedAt(null);

        Issue savedIssue = issueRepository.save(issue);
        userService.decrementClaimedIssues(userId);

        log.info("Issue {} successfully unclaimed by user {}", issueId, userId);
        return convertToDto(savedIssue);
    }

    @Transactional
    public IssueDto completeIssue(Long issueId, Long userId) {
        log.info("User {} attempting to complete issue {}", userId, issueId);

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + issueId));

        if (issue.getClaimedBy() == null || !issue.getClaimedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only complete issues that you have claimed");
        }

        issue.setStatus(Issue.IssueStatus.COMPLETED);
        issue.setCompletedAt(LocalDateTime.now());

        Issue savedIssue = issueRepository.save(issue);
        userService.updateUserStats(userId, issue.getReward());

        log.info("Issue {} successfully completed by user {}", issueId, userId);
        return convertToDto(savedIssue);
    }

    public IssueDto convertToDto(Issue issue) {
        return IssueDto.builder()
                .id(issue.getId().toString())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .difficulty(issue.getDifficulty().name().charAt(0) + issue.getDifficulty().name().substring(1).toLowerCase())
                .reward(issue.getReward())
                .repository(issue.getRepository())
                .labels(issue.getLabels())
                .claimed(issue.getClaimedBy() != null)
                .claimedBy(issue.getClaimedBy() != null ? issue.getClaimedBy().getId().toString() : null)
                .url(issue.getUrl())
                .createdAt(issue.getCreatedAt())
                .build();
    }
}