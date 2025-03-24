package com.shortking.shortUrl.util;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class SecurityConfig {

    // the key is generated using OpenSSL
    private static final String SECRET_KEY = "U0cD4LJmDiz/7Lz8oOaQJ7wKnVqz06Pzo3xBk3HRrfE="; // Keep this secret
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    // generates jwt token for logging in
    public String generateToken(String userId, String email) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("email", email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes()) // ✅ JJWT 0.9.1 compatible
                .compact();
    }

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes()) // ✅ JJWT 0.9.1 compatible
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY.getBytes()).parseClaimsJws(token); // ✅ JJWT 0.9.1 compatible
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
