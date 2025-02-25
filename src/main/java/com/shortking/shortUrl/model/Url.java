package com.shortking.shortUrl.model;


import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.Id;
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

    // Getters and Setters
    public Url(String originalUrl) {
        this.originalUrl = originalUrl;
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
//    public Url(OriginalUrl originalUrl) {
//        this.originalUrl = originalUrl;
//    }
//    public ShortUrl getShortCode() {
//        return shortCode;
//    }
//    public void setShortCode(ShortUrl shortCode) {
//        this.shortCode = shortCode;
//    }
//    public OriginalUrl getOriginalUrl() {
//        return originalUrl;
//    }
//
//    public void setOriginalUrl(OriginalUrl originalUrl) {
//        this.originalUrl = originalUrl;
//    }
}
