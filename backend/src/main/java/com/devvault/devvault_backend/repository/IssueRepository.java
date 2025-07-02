package com.devvault.devvault_backend.repository;

import com.devvault.devvault_backend.model.Issue;
import com.devvault.devvault_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Optional<Issue> findByGithubId(String githubId);
    List<Issue> findByStatus(Issue.IssueStatus status);
    List<Issue> findByClaimedBy(User user);
    List<Issue> findByDifficulty(Issue.Difficulty difficulty);

    @Query("SELECT i FROM Issue i WHERE i.status = :status AND i.claimedBy IS NULL")
    List<Issue> findAvailableIssues(@Param("status") Issue.IssueStatus status);

    @Query("SELECT i FROM Issue i WHERE " +
            "(LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.repository) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:difficulty IS NULL OR i.difficulty = :difficulty) AND " +
            "(:status IS NULL OR i.status = :status)")
    List<Issue> findIssuesWithFilters(@Param("searchTerm") String searchTerm,
                                      @Param("difficulty") Issue.Difficulty difficulty,
                                      @Param("status") Issue.IssueStatus status);
}