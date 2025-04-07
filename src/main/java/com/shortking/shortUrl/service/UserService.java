package com.shortking.shortUrl.service;

import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.repository.UserRepository;
import com.shortking.shortUrl.util.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Secure Password Hashing

    @Autowired
    private SecurityConfig securityConfig;

    public User registerUser(String email, String rawPassword) throws Exception {
        // Check if the email already exists
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            throw new Exception("Email already exists");
        }
        // Validate password length
        if (rawPassword == null || rawPassword.length() < 6) {
            throw new Exception("Password must be at least 6 characters long");

        }
        // hash password BEFORE saving to database
        String hashedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setEmail(email);
        // hash password here security: can't expose passwords in cloud database!!
        user.setPassword(hashedPassword);
        user.setIsActive(true);
        user.setCreatedAt(Instant.now().toString());
        userRepository.save(user);
        return user;
    }

    public String authenticateUser(String email, String rawPassword) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // decode hashed password from the database before comparing
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return securityConfig.generateToken(user.getId(), user.getEmail());
            }
        }
        // if it didn't match, return an exception
       else {
            throw new Exception("Invalid email or password");
        }
        // return error string
        return "error, invalid email or password";
        // For demonstration, generate a dummy token.
//        return "dummy-token-for-" + userOpt.get().getId();
    }
}