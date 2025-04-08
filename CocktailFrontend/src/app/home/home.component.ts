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
import { HttpClientModule } from '@angular/common/http';
import { CocktailService } from '../services/testdb.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CocktailResearchComponent,
    CreateUserComponent, LoginComponent], // Aggiungi ErrorComponent nelle imports
  providers: [ErrorService],
  templateUrl: './home.component.html',
  //styleUrls: ['./home.component.css']
})
export class HomeComponent {

  cocktail: any = null;
  name: string = '';
  onLogin: boolean = false;
  loggedIn: boolean = false;
  
  token: string | null = localStorage.getItem('token');
  constructor(private errorService: ErrorService, private http: HttpClient, private cs: CocktailService) {
  console.log('HomeComponent initialized');
  }

  ngOnInit(): void {
    // Verifica se l'utente è loggato (se esiste un token nel localStorage)
    const token = localStorage.getItem('token');
    this.loggedIn = token !== null;

    if (this.loggedIn) {
      // Decodifica il token per ottenere il nome dell'utente
      const decodedToken: any = jwtDecode(token as string); // decodifica il token
      this.name = decodedToken.name;  // Estrarre il nome
    }
  }

  onLoginClick(event: Event) {
    event.preventDefault();  // Impedisce il comportamento di default del form (refresh della pagina)
    this.onLogin = !this.onLogin;
  }
  sendError(): void {
    this.errorService.setError('Something went wrong on the Home page!');
  }

  testdb(): void {
    this.cs.searchCocktailByName('margarita').subscribe((res) => {
      this.cocktail = res.drinks?.[0];
      console.log('Cocktail:', this.cocktail);
    });
  }

}