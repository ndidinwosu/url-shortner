package com.shortking.shortUrl.service;


import java.time.LocalDateTime;
import java.util.*;

import com.shortking.shortUrl.common.ShortenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.repository.UrlRepository;

@Service
public class UrlService {
    @Autowired
    private UrlRepository urlRepository;

    // base link for shortening using domain name starter
    private static final String BASE_URL = "http://short.xyz/";

    // creates a shorter url given the longer one
    public String generateShortUrl(String longUrl, String customAlias, Integer expiresIn) throws Exception {
        try {
            System.out.println("generate short url");
            // check if the custom alias already exists
            if (customAlias != null && !customAlias.isEmpty()) {
                Optional<Url> aliasCheck = urlRepository.findByShortUrl(BASE_URL + customAlias);
                if (aliasCheck.isPresent()) {
                    throw new Exception("Custom alias '" + customAlias + "' is already taken! Please try another alias.");
                }
            }

            // create a new short URL
            String shortUrl = (customAlias != null && !customAlias.isEmpty()) ?
                    BASE_URL + customAlias : BASE_URL + generateRandomString();
            // set expiration date
            LocalDateTime expirationTime = (expiresIn != null) ? LocalDateTime.now().plusSeconds(expiresIn) : null;


            Url newUrl = new Url(longUrl, shortUrl, customAlias, expirationTime);
            System.out.println(shortUrl);
            // save to url repository
            urlRepository.save(newUrl);
            System.out.println("saved " + newUrl);

            return shortUrl;
        } catch (DuplicateKeyException e) {
            throw new Exception("The alias you selected is already in use. Try another alias.");
        } catch (Exception e) {
            throw new Exception("An unexpected error occurred while generating the short URL. Please try again.");
        }
    }

    // gets the long url to redirect to
    public Optional<String> getLongUrl(String shortUrl, String userIp, String userAgent, String referrer, String location) {
        Optional<Url> urlOptional = urlRepository.findByShortUrl(shortUrl);

        if (urlOptional.isPresent()) {
            Url url = urlOptional.get();

            // check if enough time has passed to expire url
            if (url.getExpiresAt() != null && LocalDateTime.now().isAfter(url.getExpiresAt())) {
                urlRepository.delete(url); // Delete expired URL
                return Optional.empty();   // Return empty (indicating expired)
            }

            // Start time for response time calculation
            LocalDateTime startTime = LocalDateTime.now();

            // Update analytics data
            updateAnalytics(url, userIp, userAgent, referrer, location, startTime);

            return Optional.of(url.getLongUrl());
        }

        return Optional.empty();
    }

    // keeps track of analytic data
    private void updateAnalytics(Url url, String userIp, String userAgent, String referrer, String location, LocalDateTime startTime) {

        // initialize states if they do not exist yet
        if (url.getDeviceStats() == null) {
            url.setDeviceStats(new HashMap<>());
        }
        if (url.getLocationStats() == null) {
            url.setLocationStats(new HashMap<>());
        }
        if (url.getReferrerStats() == null) {
            url.setReferrerStats(new HashMap<>());
        }

        // update total number of unique visitors
        if (!url.getDeviceStats().containsKey(userIp)) {
            url.setUniqueVisitors(url.getUniqueVisitors() + 1);
        }

        // update last clicked timestamp
        url.setLastClicked(LocalDateTime.now());

        // keep track device stats (desktop, mobile, etc.)
        Map<String, Integer> deviceStats = url.getDeviceStats();
        String deviceType = getDeviceType(userAgent);
        deviceStats.put(deviceType, deviceStats.getOrDefault(deviceType, 0) + 1);
        url.setDeviceStats(deviceStats);

        // track location region stats
        Map<String, Integer> locationStats = url.getLocationStats();
        locationStats.put(location, locationStats.getOrDefault(location, 0) + 1);
        url.setLocationStats(locationStats);

        // track referrer stats
        Map<String, Integer> referrerStats = url.getReferrerStats();
        referrerStats.put(referrer, referrerStats.getOrDefault(referrer, 0) + 1);
        url.setReferrerStats(referrerStats);

        // increase total number of clicks
        url.setClicks(url.getClicks() + 1);

        // updated URL data in the repo
        urlRepository.save(url);
    }

    // keep track of reponse time for each link for analytics dashabord
    public void updateResponseTime(String shortUrl, double responseTime) {
        Optional<Url> urlOptional = urlRepository.findByShortUrl(shortUrl);

        if (urlOptional.isPresent()) {
            Url url = urlOptional.get();

            // calculate new average response time
            double newAvgResponseTime = ((url.getAvgResponseTime() * url.getClicks()) + responseTime) / (url.getClicks() + 1);
            url.setAvgResponseTime(newAvgResponseTime);

            urlRepository.save(url);
        }
    }

    // keeps track of the device type each link was accessed on
    private String getDeviceType(String userAgent) {
        if (userAgent.toLowerCase().contains("mobile")) {
            return "Mobile";
        } else if (userAgent.toLowerCase().contains("tablet")) {
            return "Tablet";
        } else {
            return "Desktop";
        }
    }

    // creates a new random 6 char string from alphanumeric alphabet
    private String generateRandomString() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }


    // first algorithm for making a short url / used in early prototype
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

    public Optional<Url> checkOriginalUrlAlreadyExists(String originalUrl) {
        return urlRepository.findByOriginalUrl(originalUrl);
    }

    public Optional<Url> getOriginalUrl(String shortCode) {
        // note for later: if this doesn't work, we can use shorten util to get id and search by id instead
        return urlRepository.findByShortCode(shortCode);
    }

    public List<Url> getUserUrls(String userId) {
        return urlRepository.findByCreatedBy(userId);
    }
}