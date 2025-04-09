package com.shortking.shortUrl.controller;


import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shortking.shortUrl.model.User;
import com.shortking.shortUrl.service.UserService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UrlService urlService;

    @Operation(summary = "User Stats", description = "Compiles all the user's url statistics for the dashboard")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful response",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = List.class),
                            examples = {
                                    @ExampleObject(
                                            value = "[\n" +
                                                    " {\n" +
                                                    "  \"id\": \"string\",\n" +
                                                    "  \"short_url\": \"https://short.xyz/akW29\",\n" +
                                                    "  \"original_url\": \"https://www.example.com\",\n" +
                                                    "  \"clicks\": 0,\n" +
                                                    "  \"created_at\": \"2025-04-09T05:21:55.102Z\",\n" +
                                                    "  \"status\": \"active\",\n" +
                                                    "  \"expires_at\": \"2025-04-09T05:21:55.102Z\",\n" +
                                                    "  \"avg_response_time\": 0\n" +
                                                    "  \"last_clicked\": \"2025-04-09T05:21:55.102Z\"\n" +
                                                    "  \"device_stats\": {\n" +
                                                    "   \"additionalProp1\": 0\n" +
                                                    "   \"additionalProp2\": 0\n" +
                                                    "   \"additionalProp3\": 0\n" +
                                                    "   }\n" +
                                                    " }\n" +
                                                    "]"
                                    )
                            }
                    )
            )
    })
    @GetMapping("/stats")
    // gets all analytics associated with a user's links
    public ResponseEntity<List<Map<String, Object>>> getUserUrlAnalysis(@RequestHeader("Authorization") String authorizationHeader) {
        // get token from header
        String token = authorizationHeader.replace("Bearer ", "");
        // use method in userService to get the user
        String userId = userService.getCurrentUser(token).getId();

        List<Url> userUrls = urlService.getUserUrls(userId);

        if (userUrls.isEmpty()) {
            return ResponseEntity.status(404).body(List.of(Map.of("message", "No URLs found for user " + userId)));
        }

        // return all stats for all urls
        List<Map<String, Object>> allUrls = new ArrayList<>();

        for (Url url : userUrls) {
            Map<String, Object> urlMap = new HashMap<>();
            urlMap.put("id", url.getId());
            urlMap.put("short_url", url.getShortUrl());
            urlMap.put("original_url", url.getOriginalUrl());
            urlMap.put("clicks", url.getClicks());
            urlMap.put("created_at", url.getCreatedAt());
            urlMap.put("status", (url.isActive()) ? "active" : "expired");
            urlMap.put("expires_at", url.getExpiresAt());
            urlMap.put("unique_visitors", url.getUniqueVisitors());
            urlMap.put("avg_response_time", url.getAvgResponseTime());
            urlMap.put("device_stats", url.getDeviceStats());
            allUrls.add(urlMap);
        }
        return ResponseEntity.ok(allUrls);
    }

}
