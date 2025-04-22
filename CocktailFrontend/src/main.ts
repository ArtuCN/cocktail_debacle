// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { authInterceptor } from './app/interceptors/auth.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    ...(appConfig.providers || [])
  ]
})
.catch(err => console.error(err));
