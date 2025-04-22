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

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFromFavorites(id: string) {
    
    this.favoritesService.removeFavorite(id);
    this.loadFavorites(); // Ricarica i preferiti dopo la rimozione
  }

}
