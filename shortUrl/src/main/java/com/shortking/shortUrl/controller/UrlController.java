package com.shortking.shortUrl.controller;


import java.net.URI;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shortking.shortUrl.model.Url;
import com.shortking.shortUrl.service.UrlService;

@RestController
@RequestMapping("/urls")
public class UrlController {
    @Autowired
    private UrlService urlService;

    @PostMapping("/shorten")
    public ResponseEntity<Url> shortenUrl(@RequestBody Url url) {
        return ResponseEntity.ok(urlService.createShortUrl(url));
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        Optional<Url> url = urlService.getOriginalUrl(shortCode);
        if (url.isPresent()) {
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url.get().getOriginalUrl())).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/test")
    public String test() {
        return "test";
    }
}