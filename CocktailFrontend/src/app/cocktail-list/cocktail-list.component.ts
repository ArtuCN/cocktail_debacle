import { Component, OnInit } from '@angular/core';
import { CocktailService } from '../cocktail.service';

@Component({
  selector: 'app-cocktail-list',
  templateUrl: './cocktail-list.component.html',
  styleUrls: ['./cocktail-list.component.css']
})
export class CocktailListComponent implements OnInit {
  cocktails: any[] = [];  // Array per memorizzare i cocktail

  constructor(private cocktailService: CocktailService) {}

  ngOnInit(): void {
    // Recupera i cocktail casuali quando il componente è inizializzato
    this.cocktailService.getRandomCocktails().subscribe(data => {
      this.cocktails = data.drinks;  // Memorizza i cocktail nella variabile
    });
  }

  searchCocktail(name: string): void {
    // Quando l'utente cerca un cocktail, utilizza la funzione di ricerca per nome
    this.cocktailService.getCocktailsByName(name).subscribe(data => {
      this.cocktails = data.drinks;  // Memorizza i cocktail nella variabile
    });
  }
}
