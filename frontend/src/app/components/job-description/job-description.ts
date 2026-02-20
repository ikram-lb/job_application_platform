// src/app/components/job-description/job-description.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Requirement {
  text: string;
}

export interface JobDetail {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-description.html',
  styleUrls: ['./job-description.scss']
})
export class JobDescription {

  jobDetails: JobDetail[] = [
    { icon: '📍', label: 'Location',   value: 'Remote / Casablanca, Maroc' },
    { icon: '🕐', label: 'Type',       value: 'Full-time' },
    { icon: '💼', label: 'Experience', value: '1–3 years' },
    { icon: '💰', label: 'Salary',     value: 'Dh10k – Dh60k / year' },
    { icon: '🚀', label: 'Start',      value: 'Immediate' },
    { icon: '🏢', label: 'Department', value: 'Engineering' },
  ];

  responsibilities: string[] = [
    'Design and develop scalable, maintainable backend services using Java Spring Boot.',
    'Build responsive, high-quality frontend interfaces with Angular.',
    'Collaborate closely with product and design teams in an agile environment.',
    'Implement and enforce security best practices across the full stack.',
    'Write comprehensive unit and integration tests (target: 80%+ coverage).',
    'Participate in code reviews and contribute to engineering culture.',
    'Mentor junior developers and share knowledge across the team.',
  ];

  requirements: string[] = [
    'Proven experience with Java 17+ and the Spring ecosystem (Boot, Security, Data).',
    'Strong proficiency in Angular (v16+), TypeScript, RxJS, and modern CSS.',
    'Solid understanding of REST API design and HTTP fundamentals.',
    'Experience with relational databases (PostgreSQL, MySQL) and ORM tools.',
    'Familiarity with Docker, CI/CD pipelines, and cloud platforms (AWS / GCP).',
    'Knowledge of web security principles: OWASP Top 10, CSRF, XSS, CSP.',
    'Strong communication skills and a collaborative mindset.',
  ];

  niceToHaves: string[] = [
    'Experience with microservices architecture and message brokers (Kafka, RabbitMQ).',
    'Contributions to open-source projects.',
    'Familiarity with Kubernetes and infrastructure-as-code (Terraform).',
  ];

  perks: string[] = [
    '🏡 100% Remote flexibility',
    '📚 Dh2,000 learning budget / year',
    '🏥 Premium health insurance',
    '✈️ Annual team retreat',
    '💻 Latest MacBook Pro',
    '⏰ Flexible working hours',
  ];
}