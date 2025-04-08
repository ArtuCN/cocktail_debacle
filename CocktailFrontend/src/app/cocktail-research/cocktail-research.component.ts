import { Component, Injectable, OnInit  } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { HttpClient } from '@angular/common/http';
import { CocktailInterface } from '../models/models';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [SearchService],
  templateUrl: './cocktail-research.component.html',
  //styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {
  
  constructor(private ss: SearchService) { }
  //constructor(private rs: SignalrService) { }
  name: string = '';
  cocktails: CocktailInterface[] = [];
  errorMessage: string = '';

  searchCocktail() {
    console.log(`🔍 Cercando il cocktail: ${this.name}`);
    this.ss.getCocktailByName(this.name).subscribe({
      next: (data) => {
        console.log('Cocktail trovato:', data);
        this.cocktails = data.drinks as CocktailInterface[];
        console.log('Cocktail:', this.cocktails[0].strDrink);
        console.log('Cocktail:', this.cocktails[0].strDrinkThumb);
      },
      error: (err) => {
        console.error('Errore durante la ricerca del cocktail:', err);
      }
    });
  }
}

