package com.shortking.shortUrl.controller;

import com.shortking.shortUrl.model.RegisterRequest;
import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

//import io.swagger.annotations.ApiResponse;
//import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Example;
import io.swagger.annotations.ExampleProperty;

@RestController
@RequestMapping("/users")
public class AuthController {
    @Autowired
    private UserService userService;

    // registers a new user by email and password (saved in user repo)
    @Operation(summary = "register", description = "register a new user")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "registered successfully", 
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Map.class),
                examples = {
                    @ExampleObject(name = "success example", value = "{\"status\": \"success\"}")
                }
            )
        )
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody RegisterRequest request) {
        try {
            
            String email = request.getEmail();
            String password = request.getPassword();
            System.out.println("email: " + email + ", password: " + password);

            userService.registerUser(email, password);
            return ResponseEntity.ok(Map.of("message", " Registration successful! You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // use email and password of user to login
    @Operation(summary = "login", description = "login a user")
    @ApiResponse(
        responseCode = "401", 
        description = "login failed", 
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Map.class),
            examples = {
                @ExampleObject(name = "error example", value = "{\"error\": \"Invalid email or password\"}")
            }
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "login successfully", 
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Map.class),
                examples = {
                    @ExampleObject(name = "success example", value = "{\"status\": \"success\"}")
                }
            )
        )
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody RegisterRequest request) {
        try {
            String email = request.getEmail();
            String password = request.getPassword();

            String token = userService.authenticateUser(email, password);
            return ResponseEntity.ok(Map.of("message", "Login successful!", "token", token));
        } catch (Exception e) {
            // give error if the email and password didn't work
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
