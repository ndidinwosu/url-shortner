package com.shortking.shortUrl.model;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.lang.model.util.Elements;


@Document(collection = "urls")
@Getter
@Setter
@Schema(description = "Url model")
public class Url {
    @Schema(description = "Url database Id", example = "67f3d190b905642a6ebca529")
    @Id
    private String id;
    // used for test controller
    private String shortCode;
    private String userId;
    @Setter
    private boolean isActive;

    @Schema(description = "original long url", example = "https://www.example.com")
    private String longUrl;
    @Schema(description = "shortened url", example = "https://www.short.xyz/Sc8lp or https://www.short.xyz/example")
    private String shortUrl;
    @Schema(description = "optional custom alias for premium users", example = "example")
    @Indexed(unique = true)
    private String customAlias;
    @Schema(description = "number of times url has been clicked", example = "2")
    private int clicks;
    @Schema(description = "time url was created", example = "2025-04-08T21:38:19.66573")
    private LocalDateTime createdAt;
    @Schema(description = "time url is set to expire", example = "2025-04-08T21:38:19.66573")
    private LocalDateTime expiresAt;
    private String qrCode;
    private String createdBy;

    // Analytics Data
    @Schema(description = "number of unique visitors", example = "2")
    private int uniqueVisitors;
    @Schema(description = "set of ip addresses that have visited this url", example = "[92.168.1.1]")
    private Set<String> visitorSet;
    @Schema(description = "average time for response when url is clicked", example = "0")
    private double avgResponseTime;
    @Schema(description = "time url was last clicked", example = "2025-04-08T21:38:19.66573")
    private LocalDateTime lastClicked;
    private Map<String, Integer> deviceStats;
    private Map<String, Integer> locationStats;
    private Map<String, Integer> referrerStats;

    // Getters and Setters
    public Url(String longUrl) {
        this.longUrl = longUrl;
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
        this.visitorSet = new HashSet<>();
    }

    public Map<String, Object> response() {
        Map<String, Object> urlResponse = new HashMap<>();
        urlResponse.put("id", this.id);
        urlResponse.put("short_url", this.shortUrl);
        urlResponse.put("original_url", this.longUrl);
        urlResponse.put("clicks", this.clicks);
        urlResponse.put("created_at", this.createdAt);
        if (this.isActive) {
            urlResponse.put("status", "active");
        } else {
            urlResponse.put("status", "expired");
        }
        urlResponse.put("expires_at", this.expiresAt);
        urlResponse.put("qr_code", this.qrCode);
        return urlResponse;
    }
    public String getShortCode() {
        return shortCode;
    }
    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }
    public String getOriginalUrl() {
        return longUrl;
    }

}
