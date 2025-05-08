import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../services/signalr.service';
import { CocktailInterface } from '../models/models';
import { CommonModule } from '@angular/common';
import { SuggestionService } from '../services/suggestion.service'
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

  constructor(private ss: SuggestionService, private http: HttpClient, private srs: SignalrService) {}

  ngOnInit(): void {
    if (this.isDevelopmentMode) {
      this.dailyCocktail = Array(7).fill(this.mockCocktail); // Test con 7 cocktail
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

  getTransformValue(): number {
    const fullCard = this.cardWidth + 2 * this.cardMargin;
  
    const containerWidth = 1050; // oppure prendi dinamicamente con containerRef
    const centerOffset = (containerWidth - fullCard) / 2;
  
    return -this.activeIndex * fullCard + centerOffset;
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
  

  setDaily(ids: string[]) {
    this.dailyCocktail = [];

    ids.forEach(id => {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      this.http.get(url).subscribe((response: any) => {
        if (response.drinks?.[0]) {
          this.dailyCocktail.push(response.drinks[0]);
        }
      });
    });
  }
}
