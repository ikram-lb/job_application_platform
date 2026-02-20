package com.JobApplicationPage.JobApplicationPage.Entity;

import lombok.Data;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class ApplicationRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Valid email is required")
    @NotBlank
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Position is required")
    private String position;

}

