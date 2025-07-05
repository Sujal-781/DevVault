package com.devvault.devvault_backend.service;

import com.devvault.devvault_backend.dto.GitHubIssueDto;
import com.devvault.devvault_backend.model.Issue;
import com.devvault.devvault_backend.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubService {

    private final WebClient.Builder webClientBuilder;
    private final IssueRepository issueRepository;

    @Value("${github.api.base-url}")
    private String githubApiBaseUrl;

    @Value("${github.api.token:}")
    private String githubToken;

    public List<GitHubIssueDto> fetchIssuesFromRepository(String owner, String repo) {
        log.info("Fetching issues from GitHub repository: {}/{}", owner, repo);

        WebClient webClient = webClientBuilder
                .baseUrl(githubApiBaseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github.v3+json")
                .defaultHeader(HttpHeaders.USER_AGENT, "DevVault-App")
                .build();

        if (!githubToken.isEmpty()) {
            webClient = webClient.mutate()
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "token " + githubToken)
                    .build();
        }

        try {
            List<GitHubIssueDto> issues = webClient.get()
                    .uri("/repos/{owner}/{repo}/issues?state=open&per_page=100", owner, repo)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<GitHubIssueDto>>() {})
                    .block();

            log.info("Successfully fetched {} issues from {}/{}", issues != null ? issues.size() : 0, owner, repo);
            return issues != null ? issues : List.of();
        } catch (Exception e) {
            log.error("Error fetching issues from GitHub: {}", e.getMessage());
            return List.of();
        }
    }

    @Transactional
    public void syncIssuesFromGitHub() {
        log.info("Starting GitHub issues synchronization");

        // Popular repositories to sync issues from
        List<String> repositories = Arrays.asList(
                "facebook/react",
                "microsoft/vscode",
                "nodejs/node",
                "angular/angular",
                "vuejs/vue",
                "spring-projects/spring-boot"
        );

        for (String repo : repositories) {
            String[] parts = repo.split("/");
            String owner = parts[0];
            String repoName = parts[1];

            try {
                List<GitHubIssueDto> githubIssues = fetchIssuesFromRepository(owner, repoName);

                for (GitHubIssueDto githubIssue : githubIssues) {
                    syncSingleIssue(githubIssue, owner, repoName);
                }

                // Add delay to respect rate limits
                Thread.sleep(1000);
            } catch (Exception e) {
                log.error("Error syncing repository {}: {}", repo, e.getMessage());
            }
        }

        log.info("GitHub issues synchronization completed");
    }

    private void syncSingleIssue(GitHubIssueDto githubIssue, String owner, String repoName) {
        String githubId = githubIssue.getId().toString();

        // Check if issue already exists
        if (issueRepository.findByGithubId(githubId).isPresent()) {
            return; // Skip if already exists
        }

        // Determine difficulty based on labels
        Issue.Difficulty difficulty = determineDifficulty(githubIssue.getLabels());

        // Calculate reward based on difficulty
        int reward = calculateReward(difficulty);

        Issue issue = Issue.builder()
                .githubId(githubId)
                .title(githubIssue.getTitle())
                .description(githubIssue.getBody() != null ? githubIssue.getBody() : "")
                .repository(repoName)
                .owner(owner)
                .url(githubIssue.getHtmlUrl())
                .difficulty(difficulty)
                .reward(reward)
                .status(Issue.IssueStatus.OPEN)
                .labels(githubIssue.getLabels() != null ?
                        githubIssue.getLabels().stream()
                                .map(GitHubIssueDto.Label::getName)
                                .collect(Collectors.toList()) :
                        List.of())
                .createdAt(githubIssue.getCreatedAt())
                .build();

        issueRepository.save(issue);
        log.debug("Synced issue: {} from {}/{}", githubIssue.getTitle(), owner, repoName);
    }

    private Issue.Difficulty determineDifficulty(List<GitHubIssueDto.Label> labels) {
        if (labels == null) return Issue.Difficulty.MEDIUM;

        List<String> labelNames = labels.stream()
                .map(GitHubIssueDto.Label::getName)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        if (labelNames.contains("good first issue") ||
                labelNames.contains("beginner") ||
                labelNames.contains("easy")) {
            return Issue.Difficulty.EASY;
        }

        if (labelNames.contains("hard") ||
                labelNames.contains("complex") ||
                labelNames.contains("expert")) {
            return Issue.Difficulty.HARD;
        }

        return Issue.Difficulty.MEDIUM;
    }

    private int calculateReward(Issue.Difficulty difficulty) {
        return switch (difficulty) {
            case EASY -> 100;
            case MEDIUM -> 250;
            case HARD -> 500;
        };
    }
}