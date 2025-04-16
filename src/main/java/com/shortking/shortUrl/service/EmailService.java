package com.shortking.shortUrl.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("midnightneon2001@gmail.com"); // 发件人必须与配置一致
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("=== Sending Email ===");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
    }
    

    public void sendVerificationCode(String email, String code) {
        String subject = "Your Verification Code";
        String body = "Your verification code is: " + code + "\nIt will expire in 5 minutes.";
        send(email, subject, body);
    }
}

