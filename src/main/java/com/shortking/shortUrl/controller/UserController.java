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
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            value = "{\n" +
                                                    "  \"total_urls\": 0,\n" +
                                                    "  \"total_clicks\": 0,\n" +
                                                    "  \"active_urls\": 0,\n" +
                                                    "  \"expired_urls\": 0,\n" +
                                                    "  \"avg_response_time\": 0,\n" +
                                                    "  \"unique_visitors\": 0\n" +
                                                    "}"
                                    )
                            }
                    )
            )
    })
    @GetMapping("/stats")
    // gets all analytics associated with a user's links
    public ResponseEntity<Map<String, Object>> getUserUrlAnalysis(@RequestHeader("Authorization") String authorizationHeader) {
        // get token from header
        String token = authorizationHeader.replace("Bearer ", "");
        // use method in userService to get the user
        String userId = userService.getCurrentUser(token).getId();

        List<Url> userUrls = urlService.getUserUrls(userId);

        if (userUrls.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "No URLs found for user " + userId));
        }

        // calculating statistics for the user
        int activeUrls = 0;
        int expiredUrls = 0;
        int totalClicks = 0;
        double avgResponseTime = 0;
        int uniqueVisitors = 0;

        for (Url url : userUrls) {
            if (url.isActive()) {
                activeUrls++;
            } else {
                expiredUrls++;
            }
            totalClicks += url.getClicks();
            avgResponseTime += url.getAvgResponseTime();
            uniqueVisitors += url.getUniqueVisitors();
        }
        avgResponseTime /= userUrls.size();

//        List<Map<String, Object>> urlAnalytics = userUrls.stream().map(url -> Map.of(
//                "shortUrl", url.getShortUrl(),
//                "longUrl", url.getLongUrl(),
//                "clickCount", url.getClicks(),
//                "isActive", (url.getExpiresAt() == null || url.getExpiresAt().isAfter(LocalDateTime.now())),
//                "lastAccessTime", url.getLastClicked(),
//                "regionStats", url.getLocationStats(),
//                "deviceStats", url.getDeviceStats(),
//                "referrerStats", url.getReferrerStats()
//        )).toList();

        return ResponseEntity.ok(Map.of(
                "total_urls", userUrls.size(),
                "total_clicks", totalClicks,
                "active_urls", activeUrls,
                "expired_urls", expiredUrls,
                "avg_response_time", avgResponseTime,
                "unique_visitors", uniqueVisitors
        ));

    }

}
