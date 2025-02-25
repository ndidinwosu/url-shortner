package com.shortking.shortUrl.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
public class User {
    @Id
    private String id;
    private String email;
    private String password;
    private String name;
    private String apiKey;
    private String googleId;

    // Getters and Setters
}
