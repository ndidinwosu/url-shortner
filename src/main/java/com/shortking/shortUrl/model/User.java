package com.shortking.shortUrl.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Document(collection = "users")
@Getter
@Setter
public class User {
    // Getters and Setters
    @Id
    private String id;
    private String email;
    private String password;
    private String name;
    private String apiKey;
    private String googleId;
    private Boolean isActive;
    private LocalDateTime createdAt = LocalDateTime.now();

    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }

}
