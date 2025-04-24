// ingredient-gallery.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // 👈 IMPORTA FormsModule
import { CommonModule } from '@angular/common';
interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription?: string;
  strType?: string;
  strAlcohol?: string;
  strABV?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-ingredient-gallery',
  templateUrl: './ingredient-gallery.component.html',
  styleUrls: ['./ingredient-gallery.component.css']
})
export class IngredientGalleryComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    for (let i = 1; i < 487; i++) {
      this.http.get<any>(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?iid=${i}`)
      .subscribe(response => {
        if (response.drinks) {
          console.log("i = ", i, " response = ", response);
        }
      });
    }
  }
  //non funziona

  filterIngredients() {
    const term = this.searchTerm.toLowerCase();
    this.filteredIngredients = this.ingredients.filter(ingredient =>
      ingredient.strIngredient.toLowerCase().includes(term)
    );
  }

  getImageUrl(ingredient: string): string {
    return `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Medium.png`;
  }
  
}
