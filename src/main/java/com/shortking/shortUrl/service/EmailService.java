package com.shortking.shortUrl.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void send(String to, String subject, String body) {
        // 实际可集成 JavaMailSender、SendGrid、Mailgun 等服务
        System.out.println("=== Sending Email ===");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
    }
}
