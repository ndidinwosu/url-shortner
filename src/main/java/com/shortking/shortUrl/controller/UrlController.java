package com.shortking.shortUrl.controller;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import com.shortking.shortUrl.model.BasicUrlRequest;
import com.shortking.shortUrl.model.PremiumUrlRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shortking.shortUrl.service.UrlService;

@RestController
@RequestMapping("/urls")
public class UrlController {
    @Autowired
    private UrlService urlService;

    @Operation(summary = "Premium Shortening", description = "Shortens a Url for Premium Users, with custom options")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Premium Shortening successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": \"string\",\n" +
                                                    "  \"short_url\": \"https://short.xyz/akW29\",\n" +
                                                    "  \"original_url\": \"https://www.example.com\",\n" +
                                                    "  \"clicks\": 0,\n" +
                                                    "  \"created_at\": \"2025-04-09T05:21:55.102Z\",\n" +
                                                    "  \"status\": \"active\",\n" +
                                                    "  \"expires_at\": \"2025-04-09T05:21:55.102Z\",\n" +
                                                    "  \"qr_code\": \"string\"\n" +
                                                    "}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "Validation Error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\n" +
                                            "  \"detail\": [\n" +
                                            "    {\n" +
                                            "      \"loc\": [\"body\", 0],\n" +
                                            "      \"msg\": \"The alias you selected is already in use. Try another alias.\",\n" +
                                            "      \"type\": \"validation\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    })

    @PostMapping("/shorten-premium")
     // /shorten function that should be used for implementation. allows for custom alias and expiration time
    public ResponseEntity<Map<String, Object>> shortenUrl(@RequestBody PremiumUrlRequest request) {
        System.out.println("shorten called");
        try {
            String longUrl = request.getLongUrl();
            System.out.println(longUrl);
            String customAlias = request.getCustomAlias().isPresent() ? request.getCustomAlias().get() : null;
            Integer expiresIn = request.getExpiresIn().isPresent() ? request.getExpiresIn().get() : null;

            Map<String, Object> urlResponse = urlService.generateShortUrl(longUrl, customAlias, expiresIn);
            return ResponseEntity.ok(urlResponse);
        } catch (Exception e) {
            // return a 422 response
            return ResponseEntity.status(422).body(Map.of(
                    "detail",
                    java.util.List.of(Map.of(
                            "loc", java.util.List.of("body", 0),
                            "msg", e.getMessage(),
                            "type", "validation"
                    ))
            ));
        }
    }

    @Operation(summary = "Basic Shortening", description = "Shortens a Url for Non-Premium Users, with no custom options")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Basic Shortening successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": \"string\",\n" +
                                                    "  \"short_url\": \"https://short.xyz/akW29\",\n" +
                                                    "  \"original_url\": \"https://www.example.com\",\n" +
                                                    "  \"clicks\": 0,\n" +
                                                    "  \"created_at\": \"2025-04-09T05:21:55.102Z\",\n" +
                                                    "  \"status\": \"active\",\n" +
                                                    "  \"expires_at\": \"2025-04-09T05:21:55.102Z\",\n" +
                                                    "  \"qr_code\": \"string\"\n" +
                                                    "}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "Validation Error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\n" +
                                            "  \"detail\": [\n" +
                                            "    {\n" +
                                            "      \"loc\": [\"body\", 0],\n" +
                                            "      \"msg\": \"An unexpected error occurred while generating the short URL. Please try again.\",\n" +
                                            "      \"type\": \"validation\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    })

    @PostMapping("/shorten-basic")
    // /shorten function that should be used for non-premium users, no alias or custom expiration
    public ResponseEntity<Map<String, Object>> shortenUrlBasic(@RequestBody BasicUrlRequest request) {
        System.out.println("shorten basic called");
        try {
            String longUrl = request.getLongUrl();
            System.out.println(longUrl);
            // sets custom alias and expiration to null automatically for basic shortening
            Map<String, Object> urlResponse = urlService.generateShortUrl(longUrl, null, null);
            return ResponseEntity.ok(urlResponse);
        } catch (Exception e) {
            // return a 422 response
            return ResponseEntity.status(422).body(Map.of(
                    "detail",
                    java.util.List.of(Map.of(
                            "loc", java.util.List.of("body", 0),
                            "msg", e.getMessage(),
                            "type", "validation"
                    ))
            ));
        }
    }

    @Operation(summary = "Url Redirection", description = "Returns the original url given the shortened one")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Url Redirection successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            value = "{\n" +
                                                    "  \"original_url\": \"https://www.example.com\"\n" +
                                                    "}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "Validation Error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{\n" +
                                            "  \"detail\": [\n" +
                                            "    {\n" +
                                            "      \"loc\": [\"body\", 0],\n" +
                                            "      \"msg\": \"string\",\n" +
                                            "      \"type\": \"validation\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    })

    @GetMapping("/{shortUrl}")
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

        return ResponseEntity.ok(Map.of("original_url", longUrl.get()));
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

    @Operation(summary = "Testing function", description = "Basic GET function left for debugging")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Test page successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = {
                                    @ExampleObject(
                                            value = "{\n" +
                                                    "  \"string\": \"test\"\n" +
                                                    "}"
                                    )
                            }
                    )
            )})
     // Test page just to check if application is running properly
    @GetMapping("/test")
    public String test() {
        return "test";
    }
}