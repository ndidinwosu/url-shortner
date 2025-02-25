package com.shortking.shortUrl.repository;


import com.shortking.shortUrl.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByApiKey(String apiKey);
}