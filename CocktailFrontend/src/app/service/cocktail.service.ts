import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
      
  }
  getCocktail(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/cocktail`);
  }
}

//importiamo le varie le varie rotte capire quale è api url, questo file credo serva per collegare backend e frontend