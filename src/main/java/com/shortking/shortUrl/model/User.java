package com.shortking.shortUrl.model;

import org.springframework.data.annotation.Id;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User model")
public class User {

    @Schema(description = "User id", example = "67f3d190b905642a6ebca529")
    @Id
    private String id;

    @Schema(description = "User email", example = "user@example.com")
    private String email;

    @Schema(description = "User password", example = "password123")
    private String password;

    @Schema(description = "User active status", example = "true")
    private Boolean isActive;

    @Schema(description = "Account creation time", example = "2025-04-07T07:05:15.127Z")
    private String createdAt;

    // Add the apiKey field
    @Schema(description = "User API Key", example = "someApiKey")
    private String apiKey;

    // Getters and setters for all properties
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    public String getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    public String getApiKey() {
        return apiKey;
    }
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}