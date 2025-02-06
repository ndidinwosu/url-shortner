package com.shortking.shortUrl.service;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.repository.UrlRepository;

@Service
public class UrlService {
    @Autowired
    private UrlRepository urlRepository;

    public Url createShortUrl(Url url) {
        String shortCode = generateShortCode();
        url.setShortCode(shortCode);
        url.setCreateAt(LocalDateTime.now());
        url.setActive(true);
        return urlRepository.save(url);
    }

    private String generateShortCode() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public Optional<Url> getOriginalUrl(String shortCode) {
        return urlRepository.findByShortCode(shortCode);
    }
}