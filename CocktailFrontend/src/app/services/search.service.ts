import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://localhost:5001/api/cocktail/searchCocktailByName';
  constructor(private http: HttpClient) { }

  getCocktailByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }
}
