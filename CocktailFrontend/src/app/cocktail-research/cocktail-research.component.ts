import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { CocktailInterface } from '../models/models';
import { FavoritesService } from '../services/favorites.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [SearchService],
  templateUrl: './cocktail-research.component.html',
  //styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {
  
  constructor(private ss: SearchService,
    private favoritesService: FavoritesService,
    private router: Router
  ) { }
  name: string = '';
  cocktails: CocktailInterface[] = [];
  errorMessage: string = '';
  selectedType: string = 'name';
  underageMessage: string = '';
  favoritesMap: Map<string, boolean> = new Map<string, boolean>();
  flippedCard: boolean[] = [];
  info: boolean = false;

  // 1. Modalità di sviluppo
  isDevelopmentMode = false;

  mockCocktails: CocktailInterface[] = [
    {
    idDrink: 'DEV1',
    strDrink: 'Dev Martini',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
    strCategory: 'Cocktail',
    strAlcoholic: 'Alcoholic',
    strGlass: 'Martini Glass',
    strIngredient1: 'Gin',
    strIngredient2: 'Dry Vermouth',
    strIngredient3: null,
    strMeasure1: '60 ml',
    strMeasure2: '10 ml',
    strMeasure3: null,
    strInstructions: null, strTags: null, /* …*/
  } as CocktailInterface
  ];


  currentIndex: number = 0;

nextSlide() {
  if (this.currentIndex < this.cocktails.length - 1) {
    this.currentIndex++;
  } else {
    this.currentIndex = 0;
  }
}

prevSlide() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
  } else {
    this.currentIndex = this.cocktails.length - 1;
  }
}

  // 3. utilità per estrarre gli ingredienti  
  getIngredients(c: CocktailInterface): string[] {
    const list: string[] = [];
    const anyCocktail = c as any;
    for (let i = 1; i <= 15; i++) {
      const ing = anyCocktail[`strIngredient${i}`];
      const meas = anyCocktail[`strMeasure${i}`];
      if (ing) list.push(meas ? `${ing} – ${meas}` : ing);
    }
    return list;
  }

  isLoggedIn(): boolean {
    const mail = localStorage.getItem('mail') ?? '';
    if (mail === '') {
      return false;
    }
    else
      return true;
  }

  checkInfo(): boolean {
    if (this.info === true) {
      return true;
    }
    else {
      return false;
    }
  }


  fullInfo(str: string): void {
    sessionStorage.setItem('cocktailId', str);
    this.router.navigate(['/fullinfo']);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200.png?text=Immagine+non+disponibile';
  }

  toggleFlip(index: number) {
    this.flippedCard[index] = !this.flippedCard[index];
  }




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
    const dateOnly = raw.split('T')[0];
    const bd = new Date(dateOnly);
    if (isNaN(bd.getTime())) {
      console.warn('Wrong birthdate:');
      return false;
    }
    const age = this.calculateAge(dateOnly);
    return age < 18;
  }

   checkFavoriteStatus(id: string): void {
    this.favoritesService.isFavorite(id).subscribe({
      next: (isFav) => {
        this.favoritesMap.set(id, isFav);
      },
      error: (err) => console.error('Error', err)
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
      this.underageMessage = 'You cannot add alcoholic cocktails to your favorites until you are 18 years old.';
      return;
    }
    const id = cocktail.idDrink;
    this.favoritesService.isFavorite(id).subscribe({
      next: (isFav) => {
        if (isFav) {
          this.favoritesService.removeFavorite(id).subscribe({
            next: () => {
              this.favoritesMap.set(id, false); // Aggiorna lo stato nella mappa
            },
            error: (err) => console.error("Error ", err)
          });
        } else {
          this.favoritesService.addFavorite(cocktail).subscribe({
            next: () => {
              this.favoritesMap.set(id, true); // Aggiorna lo stato nella mappa
            },
            error: (err) => console.error("Error ", err)
          });
        }
      },
      error: (err) => console.error("Error ", err)
    });
  }

  // Aggiorna tutti gli stati dei preferiti dopo ogni ricerca
  updateFavoritesStatus(): void {
    this.cocktails.forEach(cocktail => {
      this.checkFavoriteStatus(cocktail.idDrink);
    });
  }


  searchCocktail() {

    if (this.isDevelopmentMode) {
      this.cocktails = this.mockCocktails;
      this.flippedCard = new Array(this.cocktails.length).fill(false);
      this.updateFavoritesStatus();
      return;
    }



    switch(this.selectedType)
    {
      case 'name':
        {
          this.ss.getCocktailByName(this.name).subscribe({
            next: (data) => {
              this.info = true;
              this.cocktails = data.drinks as CocktailInterface[];
              this.flippedCard = new Array(this.cocktails.length).fill(false);
              this.updateFavoritesStatus();
            },
            error: (err) => {
              console.error('Error ', err);
            }
          });
          break;
        }
        case 'ingredient':
        {
          this.ss.getCocktailByIngredient(this.name).subscribe({
            next: (data) => {
              this.info = false;
              this.cocktails = data.drinks as CocktailInterface[];
              this.flippedCard = new Array(this.cocktails.length).fill(false);
              this.updateFavoritesStatus();
            },
            error: (err) => {
              console.error('Error ', err);
            }
          });
          break;
        }
        case 'category':
          {
            this.ss.getCocktailByCategory(this.name).subscribe({
              next: (data) => {
              this.info = false;
                this.cocktails = data.drinks as CocktailInterface[];
                this.flippedCard = new Array(this.cocktails.length).fill(false);
                this.updateFavoritesStatus();
             },
              error: (err) => {
                console.error('Error ', err);
              }
            });
            break;
          }
        case 'glass':
          {
            this.ss.getCocktailByGlass(this.name).subscribe({
              next: (data) => {
                this.info = false;
                this.cocktails = data.drinks as CocktailInterface[];
                this.flippedCard = new Array(this.cocktails.length).fill(false);
                this.updateFavoritesStatus();
              },
              error: (err) => {
                console.error('Error ', err);
              }
            });
            break;
          }
      }
    } 
}