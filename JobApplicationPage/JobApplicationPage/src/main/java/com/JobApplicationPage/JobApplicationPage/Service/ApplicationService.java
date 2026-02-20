package com.JobApplicationPage.JobApplicationPage.Service;

import com.JobApplicationPage.JobApplicationPage.Entity.ApplicationRequest;
import com.JobApplicationPage.JobApplicationPage.Util.FileValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.*;

import java.io.IOException;
import java.nio.file.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

// service/ApplicationService.java
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final FileValidator fileValidator;
    private final ObjectMapper objectMapper;

    private static final String APPLICANTS_DIR = "applicants/";

    public void processApplication(ApplicationRequest request, MultipartFile cvFile) throws IOException {
        // Validate CV file
        fileValidator.validate(cvFile);

        // Create applicants directory if not exists
        Path dir = Paths.get(APPLICANTS_DIR);
        Files.createDirectories(dir);

        // Generate safe unique ID
        String applicationId = UUID.randomUUID().toString();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd__HHmmss"));

        //  Save CV file with sanitized name
        String safeExtension = StringUtils.getFilenameExtension(cvFile.getOriginalFilename());
        String cvFileName = applicationId + "_cv." + safeExtension;
        Path cvPath = dir.resolve(cvFileName);
        Files.copy(cvFile.getInputStream(), cvPath, StandardCopyOption.REPLACE_EXISTING);

        //  Build and save JSON record
        Map<String, Object> applicationData = new LinkedHashMap<>();
        applicationData.put("applicationId", applicationId);
        applicationData.put("submittedAt", timestamp);
        applicationData.put("fullName", sanitize(request.getFullName()));
        applicationData.put("email", sanitize(request.getEmail()));
        applicationData.put("phone", sanitize(request.getPhone()));
        applicationData.put("position", sanitize(request.getPosition()));
        applicationData.put("cvFile", cvFileName);

        String jsonFileName = applicationId + "_application.json";
        Path jsonPath = dir.resolve(jsonFileName);
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(jsonPath.toFile(), applicationData);
    }

    // Basic sanitization
    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "").trim();
    }
}
