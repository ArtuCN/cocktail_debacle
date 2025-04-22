import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailInterface, printCocktailDetails } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = "";
  constructor(private http: HttpClient) { }

  getCocktailByName(name: string): Observable<{drinks: CocktailInterface[]}> {
    this.apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByName';
    const response = this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
    response.subscribe(data => {
      data.drinks.forEach(drink => {
      printCocktailDetails(drink); // Print each cocktail's details
      });
    });
    return response;
  }
  getCocktailByIngredient(name: string): Observable<{drinks: CocktailInterface[]}> {
    this.apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByIngridient';
    return this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
  }
  getCocktailByCategory(name: string): Observable<{drinks: CocktailInterface[]}> {
    this.apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByCategory';
    return this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
  }
  getCocktailByGlass(name: string): Observable<{drinks: CocktailInterface[]}> {
    this.apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByGlass';
    return this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
  }
}
