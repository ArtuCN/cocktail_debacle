import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../services/favorites.service';
import { CocktailInterface } from '../models/models';

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
    console.log("mail in localstorage:", localStorage.getItem('mail'));
    this.loadFavorites();
  }

  loadFavorites(): void {
    console.log("caricamento preferiti...");
    this.favoritesService.getFavorites().subscribe({
      next: (cocktails) => {
        console.log("Preferiti ricevuti:", cocktails);
        this.favorites = cocktails;
      },
      error: (err) => console.error("❌ Errore nel recupero dei preferiti:", err)
    });
  }

  removeFromFavorites(id: string) {
    this.favoritesService.removeFavorite(id).subscribe({
      next: () => {
        this.loadFavorites(); // Ricarica i preferiti dopo la rimozione
      },
      error: (err) => console.error("❌ Errore nella rimozione del preferito:", err)
    });
  }

}
