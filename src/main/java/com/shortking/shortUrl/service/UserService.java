package com.shortking.shortUrl.service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.shortking.shortUrl.exception.ValidationException;
import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.repository.UserRepository;
import com.shortking.shortUrl.util.SecurityConfig;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Secure Password Hashing

    @Autowired
    private SecurityConfig securityConfig;

    @Autowired
    private EmailService emailService;


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
            // if user exists but just the password is wrong, tell the user they typed password wrong
            else {
                throw new ValidationException("Incorrect password");
            }
        }
        // if it didn't match, return an exception
       else {
            throw new ValidationException("Invalid email or password");
        }
    }

    // use jwt token to get the current user (needed for user dashboard statistics)
    public User getCurrentUser(String token) {
        try {
            // decode the user's token
            String userId = securityConfig.extractUserId(token);
            if (userId == null) {
                throw new ValidationException("Could not validate credentials");
            }

            // confirm that the user is in the database
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                throw new ValidationException("User not found");
            }
            return user.get();
        } catch (Exception ex) {
            throw new ValidationException("Could not validate credentials");
        }
    }

    public ResponseEntity<?> handleForgetPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Email not found"));
        }

        User user = userOpt.get();


        String resetToken = Jwts.builder()
                .setSubject(user.getId())
                .claim("email", user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15min valid
                .signWith(SignatureAlgorithm.HS256, securityConfig.getSecretKey().getBytes()) 
                .compact();

        String resetLink = "https://shortking.xyz/reset-password?code=" + resetToken;

        String content = """
            Dear user,

            Please click the following link to reset your password (valid for 15 minutes):

            %s

            If you did not request a password reset, please ignore this email.
            """.formatted(resetLink);

        emailService.send(user.getEmail(), "Reset Your Password", content);

        return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link has been sent."));
    }


    public ResponseEntity<?> handleResetPassword(String code, String newPassword) {
        if (code == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing code or newPassword"));
        }
    
        try {

            String userId = securityConfig.extractUserId(code);
            String email = securityConfig.extractEmail(code);
    

            if (!securityConfig.validateToken(code)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired reset code"));
            }
    
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
    
            User user = userOpt.get();
    

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
    
            return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid reset code"));
        }
    }
    
}