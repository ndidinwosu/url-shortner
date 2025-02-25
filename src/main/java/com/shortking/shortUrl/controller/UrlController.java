package com.shortking.shortUrl.controller;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URI;
import java.time.LocalDateTime;
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

// may need to switch to @RestController later, @Controller is for testing functionality with simple frontend
@Controller
@RequestMapping("/urls")
public class UrlController {
    @Autowired
    private UrlService urlService;

    @PostMapping("/shorten")
    @ResponseBody // needed to return json object (for frontend), will not be needed if using @RestController
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
        return ResponseEntity.ok(baseUrl + "/urls/" + urlService.createShortUrl(givenUrl).getShortCode());
    }

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
    @GetMapping("/test")
    public String test() {
        return "test";
    }
}