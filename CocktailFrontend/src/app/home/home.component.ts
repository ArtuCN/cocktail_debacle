// src/app/home/home.component.ts
import { Component, Injectable, importProvidersFrom  } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { ErrorComponent } from "../error/error.component";  // Importa il servizio di errori
import { CommonModule } from '@angular/common';
import { CocktailResearchComponent } from '../cocktail-research/cocktail-research.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { HttpClient } from '@angular/common/http';  // Inietta HttpClient come servizio
import { AuthService } from '../services/auth.service';
import { LoginComponent } from "../login/login.component";
import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CocktailResearchComponent, CreateUserComponent, LoginComponent], // Aggiungi ErrorComponent nelle imports
  providers: [ErrorService],
  templateUrl: './home.component.html',
  //styleUrls: ['./home.component.css']
})
export class HomeComponent {

  name: string = '';
  onLogin: boolean = false;
  constructor(private errorService: ErrorService, private http: HttpClient) {
  console.log('HomeComponent initialized');
  }
  onLoginClick(event: Event) {
    event.preventDefault();  // Impedisce il comportamento di default del form (refresh della pagina)
    this.onLogin = !this.onLogin;
  }
  sendError(): void {
    this.errorService.setError('Something went wrong on the Home page!');
  }
}