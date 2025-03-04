package com.shortking.shortUrl.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; // Import SecretKey
import java.util.Date;
import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.JwtException;
import java.security.Key;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationTime = 1000 * 60 * 60; // 1 小时

    public JwtUtil() {
        // 生成安全的 HMAC 密钥
        String secret = "mySecretKeyWithAtLeast512BitsLengthNeededHere!!!";
        secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(secretKey)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }
}