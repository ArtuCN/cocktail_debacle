import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  // URL di base dell'API di CocktailDB
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  // Metodo che recupera i cocktail filtrati per nome
  getCocktailsByName(cocktailName: string): Observable<any> {
    const url = `${this.apiUrl}search.php?s=${cocktailName}`;
    return this.http.get<any>(url);  // Restituisce la risposta dell'API
  }

  // Metodo che recupera una lista casuale di cocktail
  getRandomCocktails(): Observable<any> {
    const url = `${this.apiUrl}random.php`;
    return this.http.get<any>(url);  // Restituisce la risposta dell'API
  }
}
