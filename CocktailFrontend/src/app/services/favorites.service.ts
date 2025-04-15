import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
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
    localStorage.setItem(this.key, JSON.stringify([...current, cocktail])); // Aggiunge un cocktail ai preferiti
  }

  removeFavorite(id: string): void {
    const updated = this.getFavorites().filter(c => c.idDrink !== id); // Filtra i preferiti per rimuovere quello specificato
    localStorage.setItem(this.key, JSON.stringify(updated)); // Aggiorna il localStorage
  }

}