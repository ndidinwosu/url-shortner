package com.shortking.shortUrl.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shortking.shortUrl.model.Url;
import org.springframework.data.mongodb.repository.Query;

public interface UrlRepository extends MongoRepository<Url, String> {
    @Query("{shortCode:'?0'}")
    Optional<Url> findByShortCode(String shortCode);

    @Query("{originalUrl:'?0'}")
    Optional<Url> findByOriginalUrl(String original);

    @Query("{userId:'?0'}")
    List<Url> findByUserId(String userId);
}