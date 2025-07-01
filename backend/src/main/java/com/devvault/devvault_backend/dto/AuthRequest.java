// AuthRequest.java
package com.devvault.devvault_backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
