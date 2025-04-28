import { Component } from '@angular/core';
import { TermsService } from '../services/terms.service';
import { FavoritesService } from '../services/favorites.service';
import { response } from 'express';
import { CocktailInterface } from '../models/models';
import { error } from 'console';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css'
})
export class SuggestionComponent {
  
  suggestions: CocktailInterface[] = [];
  mail: string = '';
  accepted: boolean = false;
  ts!: TermsService;
  url: string = '';
  ids: number[] = [];
  
  constructor(private termsService: TermsService, private favoriteService: FavoritesService, private http: HttpClient) {
    this.ts = termsService;
    this.mail = localStorage.getItem('mail') || '';
    if (!this.mail)
      return ;
    this.hasAccepted();
  }

  hasAccepted() {
    this.ts.getTerms(this.mail).subscribe({
      next: (response: boolean) => {
        this.accepted = response;
        console.log('✔️ Terms accepted status:', this.accepted);
        this.askSuggestions();
      },
      error: (error) => {
        console.error('❌ Errore:', error);
        this.accepted = false;
      }
    });
  }
  
  print()
  {
    this.suggestions.forEach(element => {
      console.log("suggestions", element.strDrink);
    });
  }
  
  askSuggestions()
  {
    this.favoriteService.suggestion(this.mail).subscribe({
      next: (response: any) => {
        console.log("Res:", response);
        this.ids = response;
        this.ids.forEach(element => {
          this.url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${element}`;
          this.http.get(this.url).subscribe((response: any) => {
            if (response.drinks && response.drinks[0]) {
              this.suggestions.push(response.drinks[0]);
              console.log("name: ", response.drinks[0].strDrink);
            }
          });
        });
        this.print();
      },
      error: (error) => {
        console.error('❌ Errore:', error);
      }
    });
  }
}
