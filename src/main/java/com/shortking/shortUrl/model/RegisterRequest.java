package com.shortking.shortUrl.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(description = "request for login/register")
public class RegisterRequest {
    
    @ApiModelProperty(value = "email", example = "user@example.com")
    private String email;
    
    @ApiModelProperty(value = "password", example = "password123")
    private String password;

    // getters and setters
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