import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CocktailInterface } from '../models/models';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private apiUrl = 'http://localhost:5001/api/user'; // URL dell'API

  constructor(private http: HttpClient) {}

  // Prende l'email dal token
  private getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Decodifica del token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    
    console.log('Email dell\'utente:', email); // Aggiungi questo per vedere se l'email viene correttamente estratta dal token
    return email || null;
  }

  // Ottieni i preferiti dell'utente
  getFavorites(): Observable<CocktailInterface[]> {
    const email = this.getUserEmail();
    if (!email) {
      return throwError('Utente non autenticato'); // Restituisci un errore gestibile
    }
    return this.http.get<CocktailInterface[]>(`${this.apiUrl}/${email}/showfavorites`).pipe(
      catchError(error => {
        // Gestione dell'errore se l'API non risponde
        console.error('Errore nel recuperare i preferiti:', error);
        return throwError('Errore nel recupero dei preferiti.');
      })
    );
  }

  isFavorite(id: string): boolean {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some((cocktail: CocktailInterface) => cocktail.idDrink === id);
  }
  

  // Aggiungi un cocktail ai preferiti
  addFavorite(id: string): Observable<any> {
    const email = this.getUserEmail();
    if (!email) {
      return throwError('Utente non autenticato');
    }
    const url = `${this.apiUrl}/${email}/favorites/${id}`;
    console.log('Chiamata API per aggiungere preferito:', url); // Aggiungi questo per debug
    return this.http.post(url, {}).pipe(
      catchError(error => {
        console.error('Errore nell\'aggiungere il preferito:', error);
        return throwError('Errore nell\'aggiunta ai preferiti.');
      })
    );
  }
  

  // Rimuovi un cocktail dai preferiti
  removeFavorite(id: string): Observable<any> {
    const email = this.getUserEmail();
    if (!email) {
      return throwError('Utente non autenticato');
    }
    return this.http.delete(`${this.apiUrl}/${email}/removefavorites/${id}`).pipe(
      catchError(error => {
        console.error('Errore nel rimuovere il preferito:', error);
        return throwError('Errore nella rimozione dai preferiti.');
      })
    );
  }
}




/*
export class FavoritesService {

  private key = 'favoriteCocktails'; // Chiave per memorizzare i preferiti nel localStorage
  getFavorites(): any[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : []; // Restituisce un array vuoto se non ci sono preferiti
  }

  isFavorite(id: string): boolean {
    return this.getFavorites().some(c => c.idDrink === id); // Controlla se un cocktail è nei preferiti
  }

  addFavorite(cocktail: any): void {
    const current = this.getFavorites();
    localStorage.setItem(this.key, JSON.stringify([...current, cocktail]));
  }

  removeFavorite(id: string): void {
    const updated = this.getFavorites().filter(c => c.idDrink !== id); // Filtra i preferiti per rimuovere quello specificato
    localStorage.setItem(this.key, JSON.stringify(updated)); // Aggiorna il localStorage
  }

}*/