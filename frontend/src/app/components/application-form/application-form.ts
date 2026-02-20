import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { Application } from '../../services/application';

interface FileError {
  type: 'size' | 'format' | 'empty';
  message: string;
}

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application-form.html',
  styleUrls: ['./application-form.scss']
})
export class ApplicationForm implements OnInit, AfterViewInit {

  form!: FormGroup;

  selectedFile: File | null = null;
  fileError: FileError | null = null;
  fileName = '';

  captchaToken: string | null = null;
  captchaError = false;
  private captchaWidgetId: number | null = null;

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  private readonly MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  constructor(
    private fb: FormBuilder,
    private appService: Application,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.renderCaptcha();
  }

  // ── Form ──────────────────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'\-]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]],
      phone: ['', [
        Validators.pattern(/^\+?[0-9\s\-().]{7,20}$/)
      ]],
      position: ['', [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // ── reCAPTCHA ─────────────────────────────────────────────────

  private renderCaptcha(): void {
    const interval = setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        window.grecaptcha &&
        document.getElementById('recaptcha-widget')
      ) {
        try {
          this.captchaWidgetId = window.grecaptcha.render('recaptcha-widget', {
            sitekey: '6LfPLHIsAAAAABoJE8Ou8JhjyYpHwT9DT7dkJ6_o',
            theme: 'dark',
            callback: (token: string) => {
              this.captchaToken = token;
              this.captchaError = false;
              this.cdr.detectChanges();
            },
            'expired-callback': () => {
              this.captchaToken = null;
              this.captchaError = true;
              this.isSubmitting = false;
              this.cdr.detectChanges();
            },
            'error-callback': () => {
              this.captchaToken = null;
              this.captchaError = true;
              this.cdr.detectChanges();
            }
          });
        } catch (e) {
          console.error('reCAPTCHA render error', e);
        }
        clearInterval(interval);
      }
    }, 200);

    setTimeout(() => clearInterval(interval), 10_000);
  }

  private resetCaptcha(): void {
    if (typeof window !== 'undefined' && window.grecaptcha && this.captchaWidgetId !== null) {
      window.grecaptcha.reset(this.captchaWidgetId);
    }
    this.captchaToken = null;
    this.captchaWidgetId = null;
  }

  // ── File handling ──────────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = null;
    this.selectedFile = null;
    this.fileName = '';

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (file.size > this.MAX_SIZE_BYTES) {
      this.fileError = { type: 'size', message: `File exceeds 5MB. Your file is ${this.formatFileSize(file.size)}.` };
      input.value = '';
      return;
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.fileError = { type: 'format', message: 'Only PDF, DOC, and DOCX files are accepted.' };
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.removeDragHighlight();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      const input = document.getElementById('cvFile') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        this.onFileSelected({ target: input } as unknown as Event);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.addDragHighlight();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.removeDragHighlight();
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.fileError = null;
    const input = document.getElementById('cvFile') as HTMLInputElement;
    if (input) input.value = '';
  }

  private addDragHighlight(): void {
    document.querySelector('.form__dropzone')?.classList.add('form__dropzone--drag-over');
  }

  private removeDragHighlight(): void {
    document.querySelector('.form__dropzone')?.classList.remove('form__dropzone--drag-over');
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ── Submission ────────────────────────────────────────────────

  onSubmit(): void {
    this.form.markAllAsTouched();
    this.submitError = '';
    this.captchaError = false;

    if (this.isSubmitting) return;
    if (this.form.invalid) return;

    if (!this.selectedFile) {
      this.fileError = { type: 'empty', message: 'Please upload your CV before submitting.' };
      return;
    }

    if (!this.captchaToken) {
      this.captchaError = true;
      return;
    }

    this.isSubmitting = true;

    const payload = new FormData();
    payload.append('fullName',     this.form.value.fullName.trim());
    payload.append('email',        this.form.value.email.trim().toLowerCase());
    payload.append('phone',        (this.form.value.phone ?? '').trim());
    payload.append('position',     this.form.value.position);
    payload.append('captchaToken', this.captchaToken);
    payload.append('cvFile',       this.selectedFile, this.selectedFile.name);

    this.appService.submitApplication(payload).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        this.cdr.detectChanges();
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
      },
      error: (err: { message: string }) => {
        this.submitError = err.message;
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.resetCaptcha();
        setTimeout(() => this.renderCaptcha(), 100);
      }
    });
  }

  // ── Reset ─────────────────────────────────────────────────────

  resetForm(): void {
    this.form.reset();
    this.removeFile();
    this.resetCaptcha();
    this.submitSuccess = false;
    this.submitError = '';
    this.captchaError = false;
    this.isSubmitting = false;

    setTimeout(() => {
      this.renderCaptcha();
      this.cdr.detectChanges();
    }, 100);
  }

  // ── Helpers ───────────────────────────────────────────────────

  getFieldError(field: string): string | null {
    const control = this.f[field];
    if (!control || !control.errors || !control.touched) return null;

    const errors = control.errors;
    if (errors['required']) return 'This field is required.';
    if (errors['email'])    return 'Please enter a valid email address.';
    if (errors['pattern']) {
      if (field === 'phone')    return 'Please enter a valid phone number.';
      if (field === 'fullName') return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    }
    return 'Invalid value.';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.f[field];
    return !!(control && control.invalid && control.touched);
  }

  isFieldValid(field: string): boolean {
    const control = this.f[field];
    return !!(control && control.valid && control.touched && control.value);
  }
}