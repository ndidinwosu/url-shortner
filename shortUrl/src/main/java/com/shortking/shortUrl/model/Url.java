package com.shortking.shortUrl.model;


import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "urls")
@Getter
@Setter
public class Url {
    @Id
    private String id;
    private String shortCode;
    private String originalUrl;
    private String userId;
    private LocalDateTime createAt;
    private LocalDateTime expireAt;
    private boolean isActive;
    private Map<String, Object> metadata;

    // Getters and Setters
}
