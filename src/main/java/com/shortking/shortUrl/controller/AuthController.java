package com.shortking.shortUrl.controller;

import java.util.Date;
import java.util.Map;

import com.shortking.shortUrl.model.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shortking.shortUrl.exception.ValidationException;
import com.shortking.shortUrl.model.BlacklistedToken;
import com.shortking.shortUrl.model.RegisterRequest;
import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.repository.BlacklistedTokenRepository;
import com.shortking.shortUrl.service.UserService;
import com.shortking.shortUrl.util.SecurityConfig;
import com.shortking.shortUrl.service.VerificationCodeService;
import com.shortking.shortUrl.service.EmailService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/user")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    private SecurityConfig securityConfig;


    @Autowired
    private VerificationCodeService verificationCodeService;
    @Autowired
    private EmailService emailService;
    @Operation(summary = "register", description = "Register a new user")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Registered successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Map.class),
                examples = {
                    @ExampleObject(
                        name = "success example",
                        value = "{\n" +
                                "  \"email\": \"user@example.com\",\n" +
                                "  \"id\": 1,\n" +
                                "  \"is_active\": true,\n" +
                                "  \"created_at\": \"2025-04-07T07:05:15.127Z\"\n" +
                                "}"
                    )
                }
            )
        ),
        @ApiResponse(
            responseCode = "422",
            description = "Validation Error",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = "{\n" +
                            "  \"detail\": [\n" +
                            "    {\n" +
                            "      \"loc\": [\"body\", \"email\"],\n" +
                            "      \"msg\": \"Email must contain '@'\",\n" +
                            "      \"type\": \"validation\"\n" +
                            "    }\n" +
                            "  ]\n" +
                            "}"
                )
            )
        )
    })
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            return ResponseEntity.ok(Map.of(
                    "email", user.getEmail(),
                    "id", user.getId(),
                    "is_active", user.getIsActive(),
                    "created_at", user.getCreatedAt()));
        } catch (ValidationException ve) {
            return ResponseEntity.status(422).body(Map.of(
                    "detail",
                    java.util.List.of(Map.of(
                            "loc", java.util.List.of("body", "email"),
                            "msg", ve.getMessage(),
                            "type", "validation"))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "login", description = "Log in an existing user")
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Login successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Map.class),
            examples = {
                @ExampleObject(
                    name = "success example",
                    value = "{\n" +
                            "  \"access_token\": \"string\",\n" +
                            "  \"token_type\": \"Bearer\"\n" +
                            "}"
                )
            }
        )
    ),
    @ApiResponse(
        responseCode = "422",
        description = "Validation Error",
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                        "  \"detail\": [\n" +
                        "    {\n" +
                        "      \"loc\": [\"body\", \"email\"],\n" +
                        "      \"msg\": \"Invalid email or password\",\n" +
                        "      \"type\": \"validation\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}"
            )
        )
    )
})
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody RegisterRequest request) {
        try {
            // Validate email and password (customize as needed)
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                throw new ValidationException("Password is required");
            }

            // Attempt authentication
            String token = userService.authenticateUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Map.of(
                "access_token", token,
                "token_type", "Bearer"
            ));
        } catch (ValidationException ve) {
            // Return 422 for validation exceptions
            return ResponseEntity.status(422).body(Map.of(
                "detail", java.util.List.of(
                    java.util.Map.of(
                        "loc", java.util.List.of("body", "email"),
                        "msg", ve.getMessage(),
                        "type", "validation"
                    )
                )
            ));
        } catch (Exception e) {
            // For all other errors (e.g., invalid credentials), also return 422
            return ResponseEntity.status(422).body(Map.of(
                "detail", java.util.List.of(
                    java.util.Map.of(
                        "loc", java.util.List.of("body", "email"),
                        "msg", "Invalid email or password",
                        "type", "validation"
                    )
                )
            ));
        }
    }

    @Operation(summary = "logout", description = "Log out an existing user")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logout successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            name = "success example",
                                            value = "{\n" +
                                                    "  \"message\": \"Logout successful\"\n" +
                                                    "}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Validation Error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\n" +
                                            "  \"detail\": [\n" +
                                            "    {\n" +
                                            "      \"loc\": [\"body\", 0],\n" +
                                            "      \"msg\": \"Invalid token\",\n" +
                                            "      \"type\": \"validation\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7); // remove "Bearer "

        if (!securityConfig.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }

        Date expiry = securityConfig.extractExpiration(token);

        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setExpiry(expiry);

        blacklistedTokenRepository.save(blacklistedToken);

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
    @Operation(summary = "forget password", description = "Recover for when user forgets password")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logout successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            name = "success example",
                                            value = "{\n" +
                                                    "  \"message\": \"If the email exists, a reset link has been sent.\"\n" +
                                                    "}"
                                    )
                            }
                    )
            )
    })
     @PostMapping("/forget-password")
        public ResponseEntity<?> forgetPassword(@RequestParam String email) {
            return userService.handleForgetPassword(email);
        }

    @Operation(summary = "reset password", description = "User resets their password")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logout successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            name = "success example",
                                            value = "{\n" +
                                                    "  \"message\": \"Password has been reset successfully\"\n" +
                                                    "}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Validation Error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\n" +
                                            "  \"detail\": [\n" +
                                            "    {\n" +
                                            "      \"loc\": [\"body\", 0],\n" +
                                            "      \"msg\": \"Missing code or newPassword\",\n" +
                                            "      \"type\": \"validation\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    })
        @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest body) {
        String code = body.getCode();
        String newPassword = body.getNewPassword();

        return userService.handleResetPassword(code, newPassword);
    }

    @PostMapping("/send-code")
    public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = String.valueOf((int)(Math.random() * 900000) + 100000); // 6-digit code
        verificationCodeService.saveCode(email, code);
        emailService.sendVerificationCode(email, code);
        return ResponseEntity.ok("Verification code sent to email");
    }
    
}