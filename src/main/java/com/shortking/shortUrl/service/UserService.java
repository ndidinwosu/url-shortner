package com.shortking.shortUrl.service;


import java.util.Optional;

import com.shortking.shortUrl.util.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Secure Password Hashing

    @Autowired
    private SecurityConfig securityConfig;

    // test register method for initial prototype
    public User registerUser(User user) {
        user.setPassword("testpassword");
        return userRepository.save(user);
    }

    public User registerUser(String email, String rawPassword) throws Exception {
        // check if this user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("This email is already registered. Try logging in.");
        }

        // hash password before saving to database for security
        String hashedPassword = passwordEncoder.encode(rawPassword);
        User newUser = new User(email, hashedPassword);
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
        throw new Exception("Invalid email or password.");
    }

    // look through user repo for an existing email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}