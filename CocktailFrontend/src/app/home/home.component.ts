// src/app/home/home.component.ts
import { Component, Injectable, OnInit, importProvidersFrom  } from '@angular/core';
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
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { FavoritesComponent } from '../favorites/favorites.component';
import { SignalrService } from '../services/signalr.service';
import { DailyCocktailComponent } from '../daily-cocktail/daily-cocktail.component';
import { ChatComponent } from '../chat/chat.component';
import { IngredientGalleryComponent } from '../ingredient-gallery/ingredient-gallery.component';
import { ADMINPAGEComponent } from '../admin-page/admin-page.component';
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CocktailResearchComponent,
    CreateUserComponent, LoginComponent, RouterModule,
    FormsModule, FavoritesComponent, DailyCocktailComponent,
    ChatComponent, IngredientGalleryComponent, ADMINPAGEComponent], // Aggiungi ErrorComponent nelle imports
  providers: [ErrorService],
  templateUrl: './home.component.html',
  //styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  connectedClients: number = 0;
  welcomeMessage: string = '';
  ssr: SignalrService;
  cocktail: any = null;
  name: string = '';
  onLogin: boolean = false;//tasto login in alto a destra
  loggedIn: boolean = false;//loggato o no
  mail: string = '';
  isLoginMode: boolean = true; // Modalità di login o registrazione
  
  isFavoritesPage: boolean = false; // Modalità di visualizzazione dei preferiti
  favorites: any[] = []; // Array per memorizzare i cocktail preferiti

  
  token: string | null = localStorage.getItem('token');
  constructor(
    private favoritesService: FavoritesService,
    private router: Router,
    private errorService: ErrorService,
    private http: HttpClient,
    private cs: CocktailService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private ssrService: SignalrService) {
      this.ssr = ssrService;
      console.log('HomeComponent initialized');
  }

  ngOnInit(): void {
    // Verifica se l'utente è loggato (se esiste un token nel localStorage)
    const token = localStorage.getItem('token');

    if (token) {
      this.mail = localStorage.getItem('mail') as string;
      console.log('Token:', token);
      console.log('Mail:', this.mail);
      
      if (!this.mail) {
        this.mail = 'CAZZO CULO';
      }
    }
    this.loggedIn = token !== null;

    if (this.loggedIn) {
      // Decodifica il token per ottenere il nome dell'utente
      const decodedToken: any = jwtDecode(token as string); // decodifica il token
      this.name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];  // Estrarre il nome
      console.log('Nome:', this.name);
    }

    this.router.events.subscribe(() => {
      this.isFavoritesPage = this.router.url.includes('/favorites');
    });
    this.ssr.onClientCountUpdate = (count: number) => {
      this.connectedClients = count;
    };
  }


  switchToLogin(): void {
    this.isLoginMode = true;
  }

  switchToCreateUser(): void {
    this.isLoginMode = false;
  }

  onLoginClick(event: Event): void {
    event.preventDefault();  // Impedisce il comportamento di default del form (refresh della pagina)
    this.onLogin = !this.onLogin;
  }

  logout(): void {
    this.authService.logout(); // Chiama il metodo di logout del servizio AuthService
    localStorage.removeItem('mail'); // Rimuove l'email dal localStorage
    this.loggedIn = false; // Imposta loggedIn a false
    this.mail = ''; // Resetta l'email nella variabile
    this.name = ''; // Resetta il nome nella variabile
    this.onLogin = false; // Chiude il menu di login

  }


  loadFavorites(): void {
      this.favoritesService.getFavorites().subscribe({
      next: (favorites) => this.favorites = favorites,
      error: (err) => console.error(err)
    });
  }

  removeFromFavorites(id: string): void {
    this.favoritesService.removeFavorite(id); // Rimuove il cocktail dai preferiti
    this.loadFavorites(); // Ricarica i preferiti dopo la rimozione
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

  getName (): string {
    return this.name;
  }

  get announcement(): string {
    return this.ssr.announcementMessage;
  }
}