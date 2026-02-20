package com.JobApplicationPage.JobApplicationPage.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
@Service
public class RecaptchaService {

    @Value("${recaptcha.secret}")
    private String secret;

    @Value("${recaptcha.verify-url}")
    private String verifyUrl;

    public boolean verify(String token) {
        if (token == null || token.isBlank()) {
            System.out.println("CAPTCHA: token vide ou null");
            return false;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = verifyUrl + "?secret=" + secret + "&response=" + token;

            Map response = restTemplate.postForObject(url, null, Map.class);

            boolean success = response != null && Boolean.TRUE.equals(response.get("success"));

            // ← Ces logs vont apparaître dans votre console Spring Boot
            System.out.println("🔍 CAPTCHA response: " + response);
            System.out.println(success ? "✅ CAPTCHA valide" : "❌ CAPTCHA invalide");

            return success;

        } catch (Exception e) {
            System.out.println("❌ CAPTCHA erreur: " + e.getMessage());
            return false; // refuser si Google injoignable
        }
    }
}