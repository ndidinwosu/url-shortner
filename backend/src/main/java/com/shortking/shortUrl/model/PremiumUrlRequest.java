package com.shortking.shortUrl.model;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Optional;

@Schema(description = "Request to create a shortened url (premium version)")
public class PremiumUrlRequest extends BasicUrlRequest {

    @Schema(description = "Custom alias to shorten long url to", example = "myLink")
    private Optional<String> customAlias = Optional.empty();
    @Schema(description = "Time for link to last before expiring (in seconds)", example = "0")
    private Optional<Integer> expiresIn = Optional.empty();

    // Getters and Setters
    public Optional<String> getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(Optional<String> customAlias) {
        this.customAlias = customAlias;
    }

    public Optional<Integer> getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Optional<Integer> expiresIn) {
        this.expiresIn = expiresIn;
    }
}
