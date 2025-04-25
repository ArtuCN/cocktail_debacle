import { Component } from '@angular/core';
import { TermsService } from '../services/terms.service';
import { FavoritesService } from '../services/favorites.service';
import { response } from 'express';
import { CocktailInterface } from '../models/models';
import { error } from 'console';
@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css'
})
export class SuggestionComponent {
  
  mail: string = '';
  accepted: boolean = false;
  ts!: TermsService;
  
  
  constructor(private termsService: TermsService, private favoriteService: FavoritesService) {
    this.ts = termsService;
    this.mail = localStorage.getItem('mail') || '';
    if (!this.mail)
      return ;
    this.hasAccepted();
    if (this.accepted == true) {
      this.favoriteService.suggestion(this.mail).subscribe({
        next: (response: any) => {
          console.log("Res:", response);
          if (response && response.drinks) {
            const suggestedCocktails = response.drinks;
            console.log("Suggerimenti:", suggestedCocktails);
          } else {
            console.error('❌ Risposta non valida:', response);
          }
        },
        error: (error) => {
          console.error('❌ Errore:', error);
        }
      });
    }    
  }

  hasAccepted() {
    this.ts.getTerms(this.mail).subscribe({
      next: (response: boolean) => {
        this.accepted = response;
        console.log('✔️ Terms accepted status:', this.accepted);
      },
      error: (error) => {
        console.error('❌ Errore:', error);
        this.accepted = false;
      }
    });
  }
  
  

}
