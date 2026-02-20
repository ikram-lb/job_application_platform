package com.JobApplicationPage.JobApplicationPage.Util;


import org.springframework.stereotype.*;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.*;

import java.io.IOException;
import java.util.*;


@Component
public class FileValidator {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "doc", "docx");
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("CV file is required");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size must not exceed 5MB");
        }

        // Check extension
        String originalName = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (originalName == null || !ALLOWED_EXTENSIONS.contains(originalName.toLowerCase())) {
            throw new RuntimeException("Only PDF, DOC, DOCX files are allowed");
        }

        //  Check MIME type
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new RuntimeException("Invalid file type detected");
        }

        // Check Magic bytes  (checks actual file content)
        try {
            byte[] bytes = file.getBytes();
            if (!isPdfMagicBytes(bytes) && !isDocMagicBytes(bytes)) {
                throw new RuntimeException("File content does not match allowed formats");
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not read file");
        }
    }

    private boolean isPdfMagicBytes(byte[] bytes) {
        // PDF starts with %PDF
        return bytes.length > 4 &&
                bytes[0] == 0x25 && bytes[1] == 0x50 &&
                bytes[2] == 0x44 && bytes[3] == 0x46;
    }

    private boolean isDocMagicBytes(byte[] bytes) {
        // DOC/DOCX (ZIP-based) starts with PK
        return bytes.length > 2 && bytes[0] == 0x50 && bytes[1] == 0x4B;
    }
}