package com.shortking.shortUrl.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.shortking.shortUrl.model.BlacklistedToken;

public interface BlacklistedTokenRepository extends MongoRepository<BlacklistedToken, String> {
    boolean existsByToken(String token);
}
