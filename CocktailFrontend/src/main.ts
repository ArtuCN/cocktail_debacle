import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HomeComponent } from './app/home/home.component';

bootstrapApplication(HomeComponent, {providers: [provideRouter(routes)]
  
})
  .catch((err) => console.error(err));
