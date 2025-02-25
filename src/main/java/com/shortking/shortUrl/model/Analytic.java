package com.shortking.shortUrl.model;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "analytics")
@Getter
@Setter
public class Analytic {
    @Id
    private String id;
    private String urlId;
    private int totalClicks;
    private List<String> referrers;
    private Map<String, Integer> device;
    private LocalDateTime lastClickAt;

    // Getters and Setters
}