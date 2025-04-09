package com.shortking.shortUrl.controller;

import java.util.Date;
import java.util.Map;

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
            String email = request.getEmail();
            String password = request.getPassword();
//            System.out.println("email: " + email + ", password: " + password);

            // Basic validation; adjust fields as necessary
            if (email == null || !email.contains("@")) {
                throw new ValidationException("Email must contain '@'");
            }
            if (password == null || password.length() < 6) {
                throw new ValidationException("Password must be at least 6 characters long");
            }
            
            User user = userService.registerUser(email, password);
            return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "id", user.getId(),
                "is_active", user.getIsActive(),
                "created_at", user.getCreatedAt()
            ));
        } catch (ValidationException ve) {
            // Return a 422 response with your custom error format
            return ResponseEntity.status(422).body(Map.of(
                "detail", 
                // Replace the "loc" array as needed per field
                java.util.List.of(Map.of(
                    "loc", java.util.List.of("body", "email"),
                    "msg", ve.getMessage(),
                    "type", "validation"
                ))
            ));
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
     @PostMapping("/forget-password")
        public ResponseEntity<?> forgetPassword(@RequestParam String email) {
            return userService.handleForgetPassword(email);
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
            String code = body.get("code");
            String newPassword = body.get("newPassword");

            return userService.handleResetPassword(code, newPassword);
}

    
}