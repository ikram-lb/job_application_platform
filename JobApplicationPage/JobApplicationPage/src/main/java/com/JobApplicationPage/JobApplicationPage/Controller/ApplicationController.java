package com.JobApplicationPage.JobApplicationPage.Controller;

import com.JobApplicationPage.JobApplicationPage.Entity.ApplicationRequest;
import com.JobApplicationPage.JobApplicationPage.Service.ApplicationService;
import com.JobApplicationPage.JobApplicationPage.Service.RecaptchaService;
import lombok.*;
import org.springframework.http.MediaType;
import org.springframework.http.*;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final RecaptchaService RecaptchaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> submitApplication(
            @Valid @ModelAttribute ApplicationRequest request,
            @RequestParam("cvFile") MultipartFile cvFile,
            @RequestParam("captchaToken") String captchaToken,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(e -> e.getField() + ": " + e.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(Map.of("error", errors));
        }
        if (!RecaptchaService.verify(captchaToken)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "CAPTCHA expired or invalid. Please verify again."));
        }
        try {
            applicationService.processApplication(request, cvFile);

            System.out.println(">>> Nouvelle requête HTTP reçue");
            return ResponseEntity.ok(Map.of("message", "Application submitted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Server error. Please try again."));
        }
    }
}