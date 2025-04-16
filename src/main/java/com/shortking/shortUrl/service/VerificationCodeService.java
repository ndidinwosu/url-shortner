package com.shortking.shortUrl.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationCodeService {
    private final Map<String, CodeEntry> codeMap = new ConcurrentHashMap<>();
    private static final long EXPIRATION_SECONDS = 300; // 5 minutes

    public void saveCode(String email, String code) {
        codeMap.put(email, new CodeEntry(code, Instant.now().getEpochSecond()));
    }

    public boolean verifyCode(String email, String code) {
        if (!codeMap.containsKey(email)) return false;
        CodeEntry entry = codeMap.get(email);
        long now = Instant.now().getEpochSecond();
        if (now - entry.timestamp > EXPIRATION_SECONDS) {
            codeMap.remove(email);
            return false;
        }
        return entry.code.equals(code);
    }

    private static class CodeEntry {
        String code;
        long timestamp;
        CodeEntry(String code, long timestamp) {
            this.code = code;
            this.timestamp = timestamp;
        }
    }
}
