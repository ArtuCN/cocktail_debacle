import { Component, OnInit  } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CocktailInterface } from '../models/models';
import { HttpClient } from '@angular/common/http';  // Importa HttpClient per fare richieste HTTP
import { CommonModule } from '@angular/common'; // <-- IMPORTANTE
import { Console } from 'console';

@Component({
  selector: 'app-daily-cocktail',
  imports: [CommonModule],
  templateUrl: './daily-cocktail.component.html',
  //styleUrl: './daily-cocktail.component.css'
})
export class DailyCocktailComponent implements OnInit {
  dailyCocktail: any[] = [];
  currentIndex: number = 0;
  intervalId: any;
  currentCocktailIndex: number = 0;
  isMinimized = false;

  constructor(private http: HttpClient, private srs: SignalrService) {}

  ngOnInit(): void {
    this.srs.dailyId$.subscribe((id) => {
      console.log("Received ID from SignalR service:", id);
      this.setDaily(id);
    });
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  
  setDaily(ids: string[]) {
    this.dailyCocktail = [];

    ids.forEach((element) => {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${element}`;
      this.http.get(url).subscribe((response: any) => {
        if (response.drinks && response.drinks[0]) {
          this.dailyCocktail.push(response.drinks[0]);

          // Se abbiamo caricato tutti, avviamo lo slideshow
          if (this.dailyCocktail.length === ids.length) {
            this.startRotation();
          }
        }
      });
    });
  }

  startRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.dailyCocktail.length;
    }, 5000); // cambia cocktail ogni 5 secondi
  }

  getIngredients(cocktail: any): string[] {
    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(measure ? `${ingredient} - ${measure}` : ingredient);
      }
    }
    return ingredients;
  }

  prevCocktail() {
    if (this.currentCocktailIndex > 0) {
      this.currentCocktailIndex--;
    } else {
      this.currentCocktailIndex = this.dailyCocktail.length - 1; // Riparti dall'ultimo
    }
  }

  // Funzione per la navigazione al cocktail successivo
  nextCocktail() {
    if (this.currentCocktailIndex < this.dailyCocktail.length - 1) {
      this.currentCocktailIndex++;
    } else {
      this.currentCocktailIndex = 0; // Riparti dal primo
    }
  }
}


