package com.shortking.shortUrl.service;


import java.util.Optional;

import com.shortking.shortUrl.common.ShortenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.repository.UrlRepository;

@Service
public class UrlService {
    @Autowired
    private UrlRepository urlRepository;

//    public Url createShortUrl(OriginalUrl originalUrl) {
    public Url createShortUrl(String originalUrl) {
        // first, check if original url is in db already
        Optional<Url> foundUrl = checkOriginalUrlAlreadyExists(originalUrl);
        Url savedUrl = null;

        if (foundUrl.isPresent()) {
            System.out.println(originalUrl + " was already in the db.");
            // if it is already in database, return the found Url if it exists
            savedUrl = foundUrl.get();
        } else {
            System.out.println(originalUrl + " was not in the db. saving now");
            // if not, add the original url to the database
            savedUrl = new Url(originalUrl);
            urlRepository.save(savedUrl);
        }

        // create shortened url code using given database id
        String shortCode = ShortenUtil.idToStr(savedUrl.getId());
        System.out.println(originalUrl + " with id " + savedUrl.getId() + " shortened to " + shortCode);

        // update the database with Url that has both original and short fields
        savedUrl.setShortCode(shortCode);
        return urlRepository.save(savedUrl);
    }

//    public Optional<Url> checkOriginalUrlAlreadyExists(OriginalUrl originalUrl) {
//        return urlRepository.findByOriginalUrl(originalUrl.getOriginalUrl());
//    }
    public Optional<Url> checkOriginalUrlAlreadyExists(String originalUrl) {
        return urlRepository.findByOriginalUrl(originalUrl);
    }

    public Optional<Url> getOriginalUrl(String shortCode) {
        // note for later: if this doesn't work, we can use shorten util to get id and search by id instead
        return urlRepository.findByShortCode(shortCode);
    }
}