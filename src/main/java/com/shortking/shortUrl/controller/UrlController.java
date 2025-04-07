package com.shortking.shortUrl.controller;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import org.json.JSONObject;

import javax.lang.model.util.Elements;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.service.UrlService;

@RestController
@RequestMapping("/urls")
public class UrlController {
    @Autowired
    private UrlService urlService;

    @PostMapping("/shorten")
     // /shorten function that should be used for implementation. allows for custom alias
     // and expiration time
    public ResponseEntity<Map<String, String>> shortenUrl(@RequestBody Map<String, Object> request) {
        System.out.println("shorten called");
        try {
            String longUrl = (String) request.get("longUrl");
            System.out.println(longUrl);
            String customAlias = (String) request.get("customAlias");
            Integer expiresIn = request.containsKey("expiresIn") ? (Integer) request.get("expiresIn") : null;

            String shortUrl = urlService.generateShortUrl(longUrl, customAlias, expiresIn);
            return ResponseEntity.ok(Map.of("shortUrl", shortUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/expand/{shortUrl}")
    public ResponseEntity<Map<String, String>> expandUrl(@PathVariable String shortUrl,
                                                         @RequestHeader(value = "X-Forwarded-For", required = false) String userIp,
                                                         @RequestHeader(value = "User-Agent", required = false) String userAgent,
                                                         @RequestHeader(value = "Referer", required = false) String referrer,
                                                         @RequestHeader(value = "X-Geo-Location", required = false) String location) {

        // track current time for response time analytics
        Instant startTime = Instant.now();

        // initialize default values if headers do not already exist
        userIp = (userIp != null) ? userIp.split(",")[0].trim() : "unknown";
        userAgent = (userAgent != null) ? userAgent : "unknown";
        referrer = (referrer != null) ? referrer : "direct";
        location = (location != null) ? location : "unknown";

        // get region from the given location (Asia, NA, SA, EU, etc.)
        String region = getRegionFromLocation(location);

        Optional<String> longUrl = urlService.getLongUrl("http://short.xyz/" + shortUrl, userIp, userAgent, referrer, region);

        if (longUrl.isEmpty()) {
            return ResponseEntity.status(410).body(Map.of("error", "This short URL has expired or does not exist."));
        }

        // track end response time
        Instant endTime = Instant.now();
        double responseTime = Duration.between(startTime, endTime).toMillis() / 1000.0;

        // save response time for analytics
        urlService.updateResponseTime(shortUrl, responseTime);

        return ResponseEntity.ok(Map.of("longUrl", longUrl.get()));
    }

    // converts location codes to regions for analytics
    private String getRegionFromLocation(String location) {
        if (location == null || location.isEmpty() || location.equalsIgnoreCase("unknown")) {
            return "Unknown";
        }

        // convert country names or codes to regions
        String locationLower = location.toLowerCase();

        if (locationLower.contains("us") || locationLower.contains("canada") || locationLower.contains("mexico")) {
            return "North America";
        } else if (locationLower.contains("brazil") || locationLower.contains("argentina") || locationLower.contains("peru")) {
            return "South America";
        } else if (locationLower.contains("china") || locationLower.contains("india") || locationLower.contains("japan") || locationLower.contains("korea")) {
            return "Asia";
        } else if (locationLower.contains("germany") || locationLower.contains("france") || locationLower.contains("uk") || locationLower.contains("spain")) {
            return "Europe";
        } else if (locationLower.contains("australia") || locationLower.contains("new zealand")) {
            return "Oceania";
        } else if (locationLower.contains("egypt") || locationLower.contains("south africa") || locationLower.contains("nigeria")) {
            return "Africa";
        }

        return "Other";
    }

     // Test page just to check if application is running properly
    @GetMapping("/test")
    public String test() {
        return "test";
    }
}