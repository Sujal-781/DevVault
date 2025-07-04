package com.devvault.devvault_backend.config;

import com.devvault.devvault_backend.model.Issue;
import com.devvault.devvault_backend.model.Role;
import com.devvault.devvault_backend.model.User;
import com.devvault.devvault_backend.repository.IssueRepository;
import com.devvault.devvault_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeIssues();
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing default users");

            User developer = User.builder()
                    .name("John Developer")
                    .email("dev@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.DEVELOPER)
                    .githubUsername("johndev")
                    .xp(850)
                    .reputation(75)
                    .claimedIssues(5)
                    .completedIssues(3)
                    .build();

            User maintainer = User.builder()
                    .name("Sarah Maintainer")
                    .email("maintainer@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.MAINTAINER)
                    .githubUsername("sarahmaint")
                    .xp(1200)
                    .reputation(95)
                    .claimedIssues(8)
                    .completedIssues(7)
                    .build();

            userRepository.saveAll(Arrays.asList(developer, maintainer));
            log.info("Default users created successfully");
        }
    }

    private void initializeIssues() {
        if (issueRepository.count() == 0) {
            log.info("Initializing sample issues");

            List<Issue> sampleIssues = Arrays.asList(
                    Issue.builder()
                            .githubId("1")
                            .title("Add dark mode toggle to navigation")
                            .description("Implement a dark mode toggle in the main navigation bar with smooth transitions and persistent user preference storage.")
                            .repository("awesome-ui-lib")
                            .owner("techcorp")
                            .url("https://github.com/techcorp/awesome-ui-lib/issues/1")
                            .difficulty(Issue.Difficulty.EASY)
                            .reward(150)
                            .status(Issue.IssueStatus.OPEN)
                            .labels(Arrays.asList("enhancement", "good first issue"))
                            .build(),

                    Issue.builder()
                            .githubId("2")
                            .title("Fix memory leak in WebSocket connection")
                            .description("There's a memory leak occurring when WebSocket connections are not properly cleaned up on component unmount.")
                            .repository("realtime-chat")
                            .owner("startupxyz")
                            .url("https://github.com/startupxyz/realtime-chat/issues/2")
                            .difficulty(Issue.Difficulty.MEDIUM)
                            .reward(300)
                            .status(Issue.IssueStatus.OPEN)
                            .labels(Arrays.asList("bug", "high priority"))
                            .build(),

                    Issue.builder()
                            .githubId("3")
                            .title("Implement OAuth2 authentication flow")
                            .description("Add support for OAuth2 authentication with Google, GitHub, and Microsoft providers including proper error handling and token refresh.")
                            .repository("auth-service")
                            .owner("enterprise-solutions")
                            .url("https://github.com/enterprise-solutions/auth-service/issues/3")
                            .difficulty(Issue.Difficulty.HARD)
                            .reward(500)
                            .status(Issue.IssueStatus.OPEN)
                            .labels(Arrays.asList("feature", "security"))
                            .build(),

                    Issue.builder()
                            .githubId("4")
                            .title("Add unit tests for user service")
                            .description("Write comprehensive unit tests for the user service including edge cases and error scenarios.")
                            .repository("backend-api")
                            .owner("devteam")
                            .url("https://github.com/devteam/backend-api/issues/4")
                            .difficulty(Issue.Difficulty.EASY)
                            .reward(100)
                            .status(Issue.IssueStatus.OPEN)
                            .labels(Arrays.asList("testing", "good first issue"))
                            .build(),

                    Issue.builder()
                            .githubId("5")
                            .title("Optimize database queries for better performance")
                            .description("Review and optimize slow database queries, add proper indexing, and implement query caching where appropriate.")
                            .repository("data-service")
                            .owner("performance-team")
                            .url("https://github.com/performance-team/data-service/issues/5")
                            .difficulty(Issue.Difficulty.HARD)
                            .reward(400)
                            .status(Issue.IssueStatus.OPEN)
                            .labels(Arrays.asList("performance", "database"))
                            .build()
            );

            issueRepository.saveAll(sampleIssues);
            log.info("Sample issues created successfully");
        }
    }
}