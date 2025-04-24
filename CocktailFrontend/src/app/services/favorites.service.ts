import { Injectable } from '@angular/core';
import { Console } from 'node:console';
import { mainModule } from 'node:process';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, forkJoin } from 'rxjs';
import { NullLogger } from '@microsoft/signalr';
import { CocktailInterface } from '../models/models';
import { CocktailService } from './testdb.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  
  constructor(
    private http: HttpClient,
    private cocktailService: CocktailService
  ) {}

  getFavorites(): Observable<CocktailInterface[]> {
    const email = localStorage.getItem('mail');
    if (!email) {
      throw new Error("Email non trovata nel localStorage");
    }
  
    const apiUrl = `http://localhost:5001/api/user/${email}/showfavorites`;
    
    return this.http.get<string[]>(apiUrl).pipe(
      map(ids => {
        const cocktailRequests: Observable<CocktailInterface>[] = [];
        
        ids.forEach(id => {
          const cocktailRequest = this.cocktailService.getCocktailById(id).pipe(
            map(response => {
              if (response && response.drinks && response.drinks.length > 0) {
                return response.drinks[0] as CocktailInterface;
              }
              throw new Error(`Nessun cocktail trovato con ID: ${id}`);
            })
          );
          cocktailRequests.push(cocktailRequest);
        });
        
        return cocktailRequests;
      }),
      // Attendi che tutte le richieste siano completate
      switchMap(requests => forkJoin(requests).pipe(
        catchError(error => {
          console.error("Errore nel recupero dei cocktail:", error);
          return of([]);
        })
      ))
    );
  }
  

  isFavorite(id: string): Observable<boolean> {
    const email = localStorage.getItem('mail');
    if (!email) throw new Error("Email non trovata nel localStorage");

    const apiUrl = `http://localhost:5001/api/user/${email}/favorites/contains/${id}`;
    return this.http.get<boolean>(apiUrl);
  }

  addFavorite(cocktail: any): Observable<any> {
    const email = localStorage.getItem('mail');
    if (!email) {
      throw new Error("Email non trovata nel localStorage");
    }
    const apiUrl = `http://localhost:5001/api/user/${email}/favorites/${cocktail.idDrink}`;
    return this.http.post(apiUrl, {});
  }

  removeFavorite(id: string): Observable<any> {
    const email = localStorage.getItem('mail');
    if (!email) {
      throw new Error("Email non trovata nel localStorage");
    }
    const apiUrl = `http://localhost:5001/api/user/${email}/removefavorites/${id}`;
    return this.http.delete(apiUrl);
  }

}