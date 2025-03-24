package com.shortking.shortUrl.controller;


import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
//    private UserService userService;
    private UrlService urlService;

    @GetMapping("/analysis/{userId}")
    // gets all analytics associated with a user's links
    public ResponseEntity<Map<String, Object>> getUserUrlAnalysis(@PathVariable String userId) {
        List<Url> userUrls = urlService.getUserUrls(userId);

        if (userUrls.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "No URLs found for user " + userId));
        }

        List<Map<String, Object>> urlAnalytics = userUrls.stream().map(url -> Map.of(
                "shortUrl", url.getShortUrl(),
                "longUrl", url.getLongUrl(),
                "clickCount", url.getClicks(),
                "isActive", (url.getExpiresAt() == null || url.getExpiresAt().isAfter(LocalDateTime.now())),
                "lastAccessTime", url.getLastClicked(),
                "regionStats", url.getLocationStats(),
                "deviceStats", url.getDeviceStats(),
                "referrerStats", url.getReferrerStats()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "totalUrls", userUrls.size(),
                "urls", urlAnalytics
        ));
    }


//    @PostMapping("/register")
//    public ResponseEntity<User> registerUser(@RequestBody User user) {
//        return ResponseEntity.ok(userService.registerUser(user));
//    }
}
