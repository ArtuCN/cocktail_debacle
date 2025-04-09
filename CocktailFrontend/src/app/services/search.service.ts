import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailInterface } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = "";
  constructor(private http: HttpClient) { }

  getCocktailByName(name: string): Observable<{drinks: CocktailInterface[]}> {
    this.apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByName';
    return this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
  }
  getCocktailByIngredient(name: string): Observable<{drinks: CocktailInterface[]}> {
    this.apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByIngridient';
    return this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
  }
}
