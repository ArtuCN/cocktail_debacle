import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../services/signalr.service';
import { CocktailInterface } from '../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-cocktail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-cocktail.component.html',
})
export class DailyCocktailComponent implements OnInit {
  dailyCocktail: any[] = [];
  currentStartIndex = 0;
  visibleCards = 3;
  cardWidth = 300;
  cardMargin = 25;

  isDevelopmentMode = true;
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

  constructor(private http: HttpClient, private srs: SignalrService) {}

  ngOnInit(): void {
    if (this.isDevelopmentMode) {
      this.dailyCocktail = Array(7).fill(this.mockCocktail); // Test con 7 cocktail
      return;
    }

    this.srs.dailyId$.subscribe(ids => {
      this.setDaily(ids);
    });
  }

  getTransformValue(): number {
    const fullCard = this.cardWidth + 2 * this.cardMargin;
    return -this.currentStartIndex * fullCard;
  }

  getCardClass(index: number): string {
    const middle = this.currentStartIndex + Math.floor(this.visibleCards / 2);
    if (index === middle) return 'daily-card active';
    return 'daily-card';
  }

  prevSlide() {
    if (this.currentStartIndex > 0) {
      this.currentStartIndex--;
    }
  }

  nextSlide() {
    if (this.currentStartIndex + this.visibleCards < this.dailyCocktail.length) {
      this.currentStartIndex++;
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
