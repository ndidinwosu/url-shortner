package com.shortking.shortUrl.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.shortking.shortUrl.filter.JwtAuthFilter;

@Configuration
public class WebConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtFilter() {
        FilterRegistrationBean<JwtAuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(jwtAuthFilter);

        // the urls that will be filtered
        registrationBean.addUrlPatterns("/urls/shorten-premium");
        registrationBean.addUrlPatterns("/users/stats");

        return registrationBean;
    }
}
