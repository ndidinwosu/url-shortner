package com.shortking.shortUrl.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shortking.shortUrl.model.Url;

public interface UrlRepository extends MongoRepository<Url, String> {
    Optional<Url> findByShortCode(String shortCode);
    List<Url> findByUserId(String userId);
}