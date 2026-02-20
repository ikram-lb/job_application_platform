import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Application {
  private readonly apiUrl = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  submitApplication(formData: FormData): Observable<any> {
    return this.http
      .post(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred.';

    if (error.status === 0) {
      message = 'Cannot reach the server. Please check your connection.';
    } else if (error.status === 400 && error.error?.error) {
      message = error.error.error;
    } else if (error.status === 403) {
      message = 'CAPTCHA verification failed. Please try again.';
    } else if (error.status === 413) {
      message = 'File is too large. Maximum size is 5MB.';
    } else if (error.status === 500) {
      message = 'Server error. Please try again later.';
    }

    return throwError(() => ({ message }));
  }
}