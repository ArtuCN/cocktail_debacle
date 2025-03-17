// app.config.ts
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const AppConfig = {
  providers: [
    provideHttpClient(),
  ]
};
