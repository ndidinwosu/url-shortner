package com.shortking.shortUrl.common;

import java.math.BigInteger;

public class ShortenUtil {
    // randomized alphabet for the base 62 alphabet. every character from A-Z, a-z, and 0-9 appears once
    public static final String ALPHABET = "hCfBQkxpX8OjI6bR9yUmGSTMWV1ds3LEioJ0zgqN4uFrnv2caYlAPK7eZHtDw5";
    public static final int BASE = ALPHABET.length();

    // converts id for the longUrl into a string for the shortUrl
    public static String idToStr(String id){
        // ensure that it is a positive number!!
        long num = Math.abs(new BigInteger(id, 16).longValue());
        System.out.println("here is the id: " + id);
        System.out.println("here is the num: " + num);
        StringBuilder str = new StringBuilder();
        while (num > 0) {
            str.insert(0, ALPHABET.charAt((int) (num % BASE)));
            num /= BASE;
        }
        // commmented code was to limit shortCode to 7 characters, but led to many collisions
//        // limit to 7 characters, so it stays short? (can change later)
//        if (str.length() > 7) {
//            System.out.println("ok we got:" + str.substring(0, 7));
//            return str.substring(0, 7);
//        }
//        // if it is short enough, use as is
//        else {
//            System.out.println("it was short enough:" + str);
//            return str.toString();
//        }
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
