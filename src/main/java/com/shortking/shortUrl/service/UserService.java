package com.shortking.shortUrl.service;

import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(String email, String password) throws Exception {
        // Check if the email already exists
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            throw new Exception("Email already exists");
        }
        // Validate password length
        if (password == null || password.length() < 6) {
            throw new Exception("Password must be at least 6 characters long");

        // hash password before saving to database for security
        String hashedPassword = passwordEncoder.encode(rawPassword);
        User newUser = new User(email, hashedPassword);
        System.out.println("made new user: " + newUser);
        return userRepository.save(newUser);
    }

    // check if the user email and password is an actual user in repo
    public String authenticateUser(String email, String rawPassword) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return securityConfig.generateToken(user.getId(), user.getEmail());
            }
        }
        // Create and initialize a new user (ID is assumed to be auto-generated)
        User user = new User();
        user.setEmail(email);
        user.setPassword(password); // In production, hash the password!
        user.setIsActive(true);
        user.setCreatedAt(Instant.now().toString());
        userRepository.save(user);
        return user;
    }

    public String authenticateUser(String email, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            throw new Exception("Invalid email or password");
        }
        // For demonstration, generate a dummy token.
        return "dummy-token-for-" + userOpt.get().getId();
    }
}