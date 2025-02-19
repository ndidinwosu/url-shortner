package com.shortking.shortUrl.common;

public class ShortenUtil {
    // randomized alphabet for the base 62 alphabet. every character from A-Z, a-z, and 0-9 appears once
    public static final String ALPHABET = "hCfBQkxpX8OjI6bR9yUmGSTMWV1ds3LEioJ0zgqN4uFrnv2caYlAPK7eZHtDw5";
    public static final int BASE = ALPHABET.length();

    // converts id for the longUrl into a string for the shortUrl
    public static String idToStr(Long num){
        StringBuilder str = new StringBuilder();
        while (num > 0) {
            str.insert(0, ALPHABET.charAt((int) (num % BASE)));
            num /= BASE;
        }
        return str.toString();
    }

    // reverses the process, finds the id correlating to the shortURL
    public static Long strToId(String str){
        Long num = 0L;
        for (int i = 0; i < str.length(); i++) {
            num = num * BASE + ALPHABET.indexOf(str.charAt(i));
        }
        return num;
    }
}
