import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../services/signalr.service';
import { CocktailInterface } from '../models/models';
import { CommonModule } from '@angular/common';
import { SuggestionService } from '../services/suggestion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-cocktail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-cocktail.component.html'
})
export class DailyCocktailComponent implements OnInit {
  dailyCocktail: any[] = [];
  activeIndex = 0;
  visibleCards = 3;
  cardWidth = 300;
  cardMargin = 40;
  flippedDaily: boolean[] = [];

  isDevelopmentMode = false;
  private mockCocktail: CocktailInterface = {
    idDrink: 'DEV1',
    strDrink: 'Dev Cocktail',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
    strCategory: 'Mock',
    strAlcoholic: 'Non alcoholic',
    strGlass: 'Mock Glass',
    dateModified: null,
    strCreativeCommonsConfirmed: null,
    strDrinkAlternate: null,
    strIBA: null,
    strImageAttribution: null,
    strImageSource: null,
    strIngredient1: null, strIngredient2: null, strIngredient15: null,
    strMeasure1: null, strMeasure2: null, strMeasure15: null,
    strInstructions: null,
    strTags: null,
  } as any;

  @ViewChild('carouselContainer', { static: false }) containerRef!: ElementRef;

  constructor(private ss: SuggestionService,
    private http: HttpClient,
    private srs: SignalrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isDevelopmentMode) {
      this.dailyCocktail = Array(7).fill(this.mockCocktail);
      this.flippedDaily = new Array(this.dailyCocktail.length).fill(false);
      return;
    }
    this.srs.dailyId$.subscribe(ids => {
      this.setDaily(ids);
    });
    this.ss.suggestions$.subscribe(suggestions => {
      suggestions.forEach(s => {
        console.log(s.idDrink, " ", s.strDrink);
        this.dailyCocktail.push(s);
      });
    });
  }

  getIngredients(c: CocktailInterface): string[] {
    const list: string[] = [];
    const anyC = c as any;
    for (let i = 1; i <= 15; i++) {
      const ing = anyC[`strIngredient${i}`];
      const meas = anyC[`strMeasure${i}`];
      if (ing) list.push(meas ? `${ing} – ${meas}` : ing);
    }
    return list;
  }

  toggleFlipDaily(idx: number) {
    this.flippedDaily[idx] = !this.flippedDaily[idx];
  }

  setDaily(ids: string[]) {
    this.dailyCocktail = [];
    this.flippedDaily = [];
    ids.forEach(id => {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      this.http.get(url).subscribe((res: any) => {
        if (res.drinks?.[0]) {
          this.dailyCocktail.push(res.drinks[0]);
          // resetto i flag flip
          this.flippedDaily = new Array(this.dailyCocktail.length).fill(false);
        }
      });
    });
  }

  getTransformValue(): number {
    const fullCard = this.cardWidth + 2 * this.cardMargin;
  
    const containerWidth = 1050; // oppure prendi dinamicamente con containerRef
    const centerOffset = (containerWidth - fullCard) / 2;
  
    return -this.activeIndex * fullCard + centerOffset;
  }
  
  fullInfo(str: string): void {
    sessionStorage.setItem('cocktailId', str);
    this.router.navigate(['/fullinfo']);
  }

  getCardClass(index: number): string {
    return index === this.activeIndex ? 'daily-card active' : 'daily-card';
  }
  

  prevSlide() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }
  
  nextSlide() {
    if (this.activeIndex < this.dailyCocktail.length - 1) {
      this.activeIndex++;
    }
  }
  

  /*setDaily(ids: string[]) {
    this.dailyCocktail = [];

    ids.forEach(id => {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      this.http.get(url).subscribe((response: any) => {
        if (response.drinks?.[0]) {
          this.dailyCocktail.push(response.drinks[0]);
        }
      });
    });
  }*/
}
