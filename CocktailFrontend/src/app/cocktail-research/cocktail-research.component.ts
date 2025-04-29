import { Component, Injectable, OnInit  } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { HttpClient } from '@angular/common/http';
import { CocktailInterface } from '../models/models';
import { FavoritesService } from '../services/favorites.service';
import { brotliDecompress } from 'node:zlib';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [SearchService, FavoritesService],
  templateUrl: './cocktail-research.component.html',
  //styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {
  
  constructor(private ss: SearchService, private favoritesService: FavoritesService) { }
  //constructor(private rs: SignalrService) { }
  name: string = '';
  cocktails: CocktailInterface[] = [];
  errorMessage: string = '';
  selectedType: string = 'name';
  underageMessage: string = '';
  favoritesMap: Map<string, boolean> = new Map<string, boolean>();

  private calculateAge(birthdate: string): number {
    const bd = new Date(birthdate);
    const now = new Date();
    let age = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
    return age;
  }

  isUnderage(): boolean {
    const raw = localStorage.getItem('birthdate') || '';
    console.log("raw birthday from storage", raw);
    const dateOnly = raw.split('T')[0];
    const bd = new Date(dateOnly);
    if (isNaN(bd.getTime())) {
      console.warn('Data di nascita non valida:');
      return false;
    }
    const age = this.calculateAge(dateOnly);
    console.log(`🔢 parsed birthdate: ${dateOnly}, age: ${age}`);
    return age < 18;
  }

   // Modifica questo metodo per memorizzare lo stato nella mappa
   checkFavoriteStatus(id: string): void {
    this.favoritesService.isFavorite(id).subscribe({
      next: (isFav) => {
        this.favoritesMap.set(id, isFav);
      },
      error: (err) => console.error('Errore durante la verifica del preferito', err)
    });
  }

  isFavorite(id: string): boolean {
    return this.favoritesMap.get(id) || false;
  }
  

  // Aggiorna questo metodo per aggiornare anche la mappa
  toggleFavorite(cocktail: CocktailInterface): void {
    this.underageMessage = '';
    const isAlcoholic = cocktail.strAlcoholic === 'Alcoholic';
    if (this.isUnderage() && isAlcoholic) {
      this.underageMessage = 'Non puoi aggiungere cocktail alcolici ai preferiti finché non hai compiuto 18 anni.';
      return;
    }
    const id = cocktail.idDrink;
    this.favoritesService.isFavorite(id).subscribe({
      next: (isFav) => {
        if (isFav) {
          this.favoritesService.removeFavorite(id).subscribe({
            next: () => {
              this.favoritesMap.set(id, false); // Aggiorna lo stato nella mappa
              console.log("Rimosso dai preferiti");
            },
            error: (err) => console.error("Errore nella rimozione", err)
          });
        } else {
          this.favoritesService.addFavorite(cocktail).subscribe({
            next: () => {
              this.favoritesMap.set(id, true); // Aggiorna lo stato nella mappa
              console.log("Aggiunto ai preferiti");
            },
            error: (err) => console.error("Errore nell'aggiunta", err)
          });
        }
      },
      error: (err) => console.error("Errore nella verifica del preferito", err)
    });
  }

  // Aggiorna tutti gli stati dei preferiti dopo ogni ricerca
  updateFavoritesStatus(): void {
    this.cocktails.forEach(cocktail => {
      this.checkFavoriteStatus(cocktail.idDrink);
    });
  }


  searchCocktail() {
    switch(this.selectedType)
    {
      case 'name':
        {
          this.ss.getCocktailByName(this.name).subscribe({
            next: (data) => {
              this.cocktails = data.drinks as CocktailInterface[];
              this.updateFavoritesStatus();
            },
            error: (err) => {
              console.error('Errore durante la ricerca del cocktail:', err);
            }
          });
          break;
        }
        case 'ingredient':
        {
          this.ss.getCocktailByIngredient(this.name).subscribe({
            next: (data) => {
              this.cocktails = data.drinks as CocktailInterface[];
              this.updateFavoritesStatus();
            },
            error: (err) => {
              console.error('Errore durante la ricerca del cocktail:', err);
            }
          });
          break;
        }
        case 'category':
          {
            this.ss.getCocktailByCategory(this.name).subscribe({
              next: (data) => {
                this.cocktails = data.drinks as CocktailInterface[];
                this.updateFavoritesStatus();
             },
              error: (err) => {
                console.error('Errore durante la ricerca del cocktail:', err);
              }
            });
            break;
          }
        case 'glass':
          {
            this.ss.getCocktailByGlass(this.name).subscribe({
              next: (data) => {
                this.cocktails = data.drinks as CocktailInterface[];
                this.updateFavoritesStatus();
              },
              error: (err) => {
                console.error('Errore durante la ricerca del cocktail:', err);
              }
            });
            break;
          }
      }
    } 
}

