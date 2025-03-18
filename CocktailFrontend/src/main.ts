import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const AppConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};
