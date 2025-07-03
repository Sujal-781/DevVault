package com.devvault.devvault_backend.exception;

public class IssueAlreadyClaimedException extends RuntimeException {
    public IssueAlreadyClaimedException(String message) {
        super(message);
    }
}