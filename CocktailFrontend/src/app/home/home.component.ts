// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { ErrorComponent } from "../error/error.component";  // Importa il servizio di errori
import { CommonModule } from '@angular/common';
import { CocktailResearchComponent } from '../cocktail-research/cocktail-research.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ErrorComponent, CocktailResearchComponent], // Aggiungi ErrorComponent nelle imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  name: string = '';
  constructor(private errorService: ErrorService) {}

  // Funzione per inviare un errore quando il bottone viene cliccato
  sendError(): void {
    this.errorService.setError('Something went wrong on the Home page!');
  }
  searchCocktail(): void {
    this.searchCocktail();
  }
}
