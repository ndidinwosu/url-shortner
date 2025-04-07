package com.shortking.shortUrl.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User registration (and login) request")
public class RegisterRequest {

    @Schema(description = "User email", example = "user@example.com")
    private String email;

    @Schema(description = "User password", example = "password123")
    private String password;

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
}