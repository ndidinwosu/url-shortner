package com.shortking.shortUrl.controller;

import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    // registers a new user by email and password (saved in user repo)
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            userService.registerUser(email, password);
            return ResponseEntity.ok(Map.of("message", " Registration successful! You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // use email and password of user to login
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            String token = userService.authenticateUser(email, password);
            return ResponseEntity.ok(Map.of("message", "Login successful!", "token", token));
        } catch (Exception e) {
            // give error if the email and password didn't work
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
