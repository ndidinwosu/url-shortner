package com.shortking.shortUrl.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to create a shortened url (basic version)")
public class BasicUrlRequest {

    @Schema(description = "Long url to be shortened", example = "https://www.example.com")
    private String longUrl;

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }
}

