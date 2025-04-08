// src/app/services/cocktail.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CocktailService {
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  searchCocktailByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?s=${name}`);
  }

  getCocktailById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lookup.php?i=${id}`);
  }

  getRandomCocktail(): Observable<any> {
    return this.http.get(`${this.apiUrl}/random.php`);
  }

  searchByIngredient(ingredient: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?i=${ingredient}`);
  }
}
