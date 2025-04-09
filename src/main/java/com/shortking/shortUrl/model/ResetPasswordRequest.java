package com.shortking.shortUrl.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to reset password")
public class ResetPasswordRequest {

    @Schema(description = "User authentication token", example = "string")
    private String code;
    @Schema(description = "User's new password", example = "string")
    private String newPassword;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    public String getNewPassword() {
        return this.newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
