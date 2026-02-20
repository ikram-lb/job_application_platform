import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ApplicationForm } from './components/application-form/application-form';
import { JobDescription } from './components/job-description/job-description';

@Component({
  selector: 'app-root',
  imports: [Header, ApplicationForm, JobDescription,Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',

})

export class App {
  protected readonly title = signal('frontend');
}
