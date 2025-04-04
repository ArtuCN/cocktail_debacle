import { Component, OnInit  } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cocktail-research.component.html',
  //styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {
  
  constructor(private ss: SearchService) { }
  //constructor(private rs: SignalrService) { }
  name: string = '';
  cocktails: any[] = [];
  errorMessage: string = '';

  searchCocktail() {
    console.log(`🔍 Cercando il cocktail: ${this.name}`);
    this.ss.getCocktailByName(this.name).subscribe({
      next: (data) => {
        console.log('Cocktail trovato:', data);
        this.cocktails = data;
      },
      error: (err) => {
        console.error('Errore durante la ricerca del cocktail:', err);
      }
    });
  }
/*
  ngOnInit() {
    this.rs.onReceiveCocktails((cocktails) => {
      console.log('🍹 Cocktail recived:', cocktails);
      this.cocktails = cocktails; // Aggiorna la variabile
    });

    // Ascolta eventuali errori
    this.rs.onReceiveError((error) => {
      console.error('❌ Errore recived:', error);
    });
  }
  searchCocktail(): void {
    if (this.name.trim()) {
      console.log(`🔍 Searching: ${this.name}`);
      this.rs.searchbyname(this.name);
    } else {
      console.warn('⚠️');
    }
  }*/

}

