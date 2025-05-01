//package com.shortking.shortUrl;
//import com.shortking.shortUrl.common.ShortenUtil;
//import com.shortking.shortUrl.model.OriginalUrl;
//import com.shortking.shortUrl.model.ShortUrl;
//import com.shortking.shortUrl.model.Url;
//import com.shortking.shortUrl.repository.UrlRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//
//@SpringBootApplication
//public class ShortUrlApplication implements CommandLineRunner {
//
//	@Autowired
//	private UrlRepository urlRepository;
//
//	public static void main(String[] args) {
//		SpringApplication.run(ShortUrlApplication.class, args);
//	}
//
//	@Override
//	public void run(String... args) throws Exception {
//		// Test data to insert
////		OriginalUrl originalUrl = new OriginalUrl("https://example.com");
////		ShortUrl shortUrl = new ShortUrl(ShortenUtil.idToStr(12L));
////		Url testUrl = new Url(originalUrl);
////		testUrl.setShortCode(shortUrl);
//
//		Url testUrl = new Url("https://google.com");
//
//		// Insert the data into MongoDB
//		urlRepository.save(testUrl);
//
//		// attempt taking it out of the database and created shortcode with it
//		String shortCode = ShortenUtil.idToStr(testUrl.getId());
//		testUrl.setShortCode(shortCode);
//		urlRepository.save(testUrl);
//
//		// Print confirmation
//		System.out.println("Data inserted successfully!");
//
//		// Optionally, retrieve and print the inserted URL
//		Long testId = ShortenUtil.strToId(testUrl.getShortCode());
//		System.out.println("hashing from str to id, got : " + testId);
//		Url retrievedUrl = urlRepository.findByShortCode(testUrl.getShortCode()).orElse(null);
//		if (retrievedUrl != null) {
//			System.out.println("Retrieved URL: " + retrievedUrl.getOriginalUrl());
//		} else {
//			System.out.println("URL not found.");
//		}
//	}
//}


package com.shortking.shortUrl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShortUrlApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShortUrlApplication.class, args);
	}

}
