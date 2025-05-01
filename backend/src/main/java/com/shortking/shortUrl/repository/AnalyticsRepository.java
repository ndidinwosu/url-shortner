package com.shortking.shortUrl.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shortking.shortUrl.model.Analytic;

public interface AnalyticsRepository extends MongoRepository<Analytic, String> {
    Optional<Analytic> findByUrlId(String urlId);
}
