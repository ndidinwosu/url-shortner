package com.shortking.shortUrl.model;


import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import javax.lang.model.util.Elements;

@Document(collection = "urls")
@Getter
@Setter
public class Url {
    @Id
    private String id;
//    private ShortUrl shortCode;
//    private OriginalUrl originalUrl;
    private String shortCode;
    private String originalUrl;
    private String userId;
    private LocalDateTime createAt;
    private LocalDateTime expireAt;
    private boolean isActive;
    private Map<String, Object> metadata;

    private String longUrl;
    private String shortUrl;
    @Indexed(unique = true)
    private String customAlias;
    private int clicks;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String qrCode;
    private String createdBy;

    // Analytics Data
    private int uniqueVisitors;
    private double avgResponseTime;
    private LocalDateTime lastClicked;
    private Map<String, Integer> deviceStats;
    private Map<String, Integer> locationStats;
    private Map<String, Integer> referrerStats;

    // Getters and Setters
    public Url(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public Url() {
        this.createdAt = LocalDateTime.now();
        this.clicks = 0;
    }

    public Url(String longUrl, String shortUrl, String customAlias, LocalDateTime expiresAt) {
        this.longUrl = longUrl;
        this.shortUrl = shortUrl;
        this.customAlias = customAlias;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = expiresAt;
        this.clicks = 0;
    }
    public String getShortCode() {
        return shortCode;
    }
    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }
    public String getOriginalUrl() {
        return originalUrl;
    }

}
