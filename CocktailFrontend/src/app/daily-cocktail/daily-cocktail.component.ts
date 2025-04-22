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
  styleUrl: './daily-cocktail.component.css'
})
export class DailyCocktailComponent implements OnInit {
  dailyCocktail: CocktailInterface | null = null;

  constructor(private http: HttpClient, private srs: SignalrService) {}

  ngOnInit(): void {
    this.srs.dailyId$.subscribe((id) => {
      console.log("Received ID from SignalR service:", id);
      this.setDaily(id);
    });
  }

  setDaily(id: string) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    this.http.get(url).subscribe((response: any) => {
      this.dailyCocktail = response.drinks ? response.drinks[0] : null;
      console.log("Fetched cocktail:", this.dailyCocktail);
    });
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
}

