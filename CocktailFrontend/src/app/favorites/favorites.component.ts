import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../services/favorites.service';
import { CocktailInterface } from '../models/models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  //styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: CocktailInterface[] = [];
  errorMessage: string | null = null;
  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
      },
      error: (err) => {
        this.errorMessage = err; // Gestisci l'errore se necessario
      }
    });
  }

  addToFavorites(id: string): void {
    this.favoritesService.addFavorite(id).subscribe({
      next: () => {
        this.loadFavorites(); // Ricarica i preferiti dopo aver aggiunto
      },
      error: (err) => {
        this.errorMessage = err; // Gestisci l'errore se necessario
      }
    });
  }

  removeFromFavorites(id: string): void {
    this.favoritesService.removeFavorite(id).subscribe({
      next: () => {
        this.loadFavorites(); // Ricarica i preferiti dopo aver rimosso
      },
      error: (err) => {
        this.errorMessage = err; // Gestisci l'errore se necessario
      }
    });
  }
}