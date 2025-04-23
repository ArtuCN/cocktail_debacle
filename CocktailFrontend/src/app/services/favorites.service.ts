import { Injectable } from '@angular/core';
import { Console } from 'node:console';
import { mainModule } from 'node:process';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NullLogger } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  
  constructor(private http: HttpClient) {}
  getFavorites(): Observable<string[]> {
    const email = localStorage.getItem('mail');
    if (!email) {
      throw new Error("Email non trovata nel localStorage");
    }
  
    const apiUrl = `http://localhost:5001/api/user/${email}/showfavorites`;
    return this.http.get<string[]>(apiUrl);
  }
  

  isFavorite(id: string): Observable<boolean> {
    const email = localStorage.getItem('mail');
    if (!email) throw new Error("Email non trovata nel localStorage");

    const apiUrl = `http://localhost:5001/api/user/${email}/favorites/contains/${id}`;
    return this.http.get<boolean>(apiUrl);
  }

  addFavorite(cocktail: any) {
    const email = localStorage.getItem('mail');
    if (!email) {
      throw new Error("Email non trovata nel localStorage");
    }
    const apiUrl = `http://localhost:5001/api/user/${email}/favorites/${cocktail.idDrink}`;
    this.http.post(apiUrl, {}).subscribe({
      next: (res) => console.log("✅ Successo!", res),
      error: (err) => console.error("❌ Errore POST:", err)
    }); 
  }

  removeFavorite(id: string): void {
    const email = localStorage.getItem('mail');
    if (!email) {
      throw new Error("Email non trovata nel localStorage");
    }
    const apiUrl = `http://localhost:5001/api/user/${email}/removefavorites/${id}`;
    this.http.delete(apiUrl, {}).subscribe({
      next: (res) => console.log("✅ Successo!", res),
      error: (err) => console.error("❌ Errore DELETE:", err)
    }); 
  }

}