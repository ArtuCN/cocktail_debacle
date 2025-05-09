import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../services/favorites.service';
import { CocktailInterface } from '../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  providers: [FavoritesService],
  templateUrl: './favorites.component.html',
  //styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: CocktailInterface[] = [];

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (cocktails) => {
        this.favorites = cocktails;
      },
      error: (err) => console.error("Error ", err)
    });
  }

  removeFromFavorites(id: string) {
    this.favoritesService.removeFavorite(id).subscribe({
      next: () => {
        this.loadFavorites(); // Ricarica i preferiti dopo la rimozione
      },
      error: (err) => console.error("Error ", err)
    });
  }

}
