// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),HttpClient,  
    ...(appConfig.providers || [])
  ]
})
.catch(err => console.error(err));