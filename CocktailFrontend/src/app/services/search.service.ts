import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailInterface } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByName';
  constructor(private http: HttpClient) { }

  getCocktailByName(name: string): Observable<{drinks: CocktailInterface[]}> {
    return this.http.get<{drinks: CocktailInterface[]}>(`${this.apiUrl}${name}`);
  }
}
