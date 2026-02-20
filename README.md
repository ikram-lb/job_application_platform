# 🏢 TechCorp — Job Application Platform

> A professional, secure full-stack job application portal.
<img width="1362" height="595" alt="image" src="https://github.com/user-attachments/assets/eae74b22-cabd-4205-950a-8a1444120dbd" />
<img width="1365" height="642" alt="image" src="https://github.com/user-attachments/assets/f8f8a7f1-2e61-4a9d-950a-cde11f5aeb0d" />
<img width="1366" height="647" alt="image" src="https://github.com/user-attachments/assets/dea54cbb-883e-4609-b33f-fcc7f74b749a" />
<img width="1366" height="646" alt="image" src="https://github.com/user-attachments/assets/372b2d46-8a28-484f-9a18-541812b6b059" />
<img width="1366" height="645" alt="image" src="https://github.com/user-attachments/assets/d13e1709-141e-443f-ba92-1c461ad9ae8b" />
<img width="1357" height="646" alt="image" src="https://github.com/user-attachments/assets/1a8f635d-3a12-4ea3-8102-1be4f9e6ca6b" />

---

#

## 🎯 Project Overview

This project is a complete job application landing page . It allows candidates to:

- Read a detailed job description
- Fill in a personal information form
- Upload their CV (PDF / DOC / DOCX)
- Submit their application securely

Every submission is validated on both the client and server sides, protected against bot abuse via reCAPTCHA v2, and stored as a structured JSON file alongside the uploaded CV.

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Angular 21, TypeScript, SCSS        |
| Backend   | Java 17, Spring Boot 3, Maven       |
| Security  | reCAPTCHA v2, CSP, CSRF, Bean Validation |
| Storage   | Local file system (JSON + CV files) |

---



---



> Install Angular CLI globally if not present:
> ```bash
> npm install -g @angular/cli
> ```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/ikram-lb/job_application_platform.git]
```

---

### 2. Configure reCAPTCHA Keys

This project uses **Google reCAPTCHA v2**. You need to register your own keys.

#### Get your keys:
1. Go to [https://www.google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create)
2. Choose **reCAPTCHA v2 → "I'm not a robot" checkbox**
3. Add `localhost` to the allowed domains
4. Copy your **Site Key** (public) and **Secret Key** (private)

#### Set the Site Key in the frontend:

Open `frontend/src/app/components/application-form/application-form.ts` and replace:

```typescript
sitekey: '6LfPLHIsAAAAABoJE8Ou8JhjyYpHwT9DT7dkJ6_o',
```

#### Set the Secret Key in the backend:

Open `backend/src/main/resources/application.properties` and replace:

```properties
recaptcha.secret=6LfPLHIsAAAAAO-HGUBNB_epKuhIV9zu9SN4BP83


### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start at: **http://localhost:8080**

You should see in the console:
```
Started JobApplicationPageApplication in X seconds
```

> The `applicants/` folder is created automatically on the first form submission.

---

### 4. Run the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm install
ng serve
```

The app will be available at: **http://localhost:4200**




