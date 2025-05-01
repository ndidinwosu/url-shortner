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

//@Controller is for testing functionality with simple frontend
@Controller
@RequestMapping("/test")
public class TestController {
    @Autowired
    private UrlService urlService;

    @PostMapping("/shortenTest")
    @ResponseBody // needed to return json object (for frontend), will not be needed if using @RestController
    // Test version of /shorten, made specifically for quick testing with test.html. Returns JSON
    // object for interaction with test.html. Should not be relied on for actual implementation.
    public ResponseEntity<String> shortenUrl(@RequestBody String origUrl, HttpServletRequest request) {
        // check if the given url is a valid one
        System.out.println(origUrl);
        JSONObject jsonObject = new JSONObject(origUrl);
        String givenUrl = jsonObject.getString("url");
        try {
            new URL(givenUrl);
        } catch (MalformedURLException e) {
            System.out.println("Malformed URL: " + givenUrl);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Given url is invalid", e);
        }
        // if the url is valid, get the first part of the url to attach to the short code
        StringBuffer url = request.getRequestURL();
        String baseUrl = url.substring(0, url.indexOf(request.getRequestURI()));
        return ResponseEntity.ok(baseUrl + "/test/" + urlService.createShortUrl(givenUrl).getShortCode());
    }

    // created testing first prototype with test.html, not necessary
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        System.out.println("attempting a redirect using " + shortCode);
        // get short code from database and redirect using that
        Optional<Url> foundUrl = urlService.getOriginalUrl(shortCode);
        if (foundUrl.isPresent()) {
            System.out.println("found " + foundUrl.get().getShortCode());
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(foundUrl.get().getOriginalUrl())).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Test page just to check if application is running properly
    @GetMapping("/test")
    public String test() {
        return "test";
    }
}