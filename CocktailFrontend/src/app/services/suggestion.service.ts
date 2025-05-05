import { Injectable } from '@angular/core';
import { TermsService } from './terms.service';
import { FavoritesService } from './favorites.service';
import { HttpClient } from '@angular/common/http';
import { CocktailInterface } from '../models/models';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SuggestionService {

  private suggestionsSubject = new BehaviorSubject<CocktailInterface[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();

  private acceptedTerms = false;
  private mail: string = '';

  constructor(
    private termsService: TermsService,
    private favoritesService: FavoritesService,
    private http: HttpClient
  ) {
    this.mail = localStorage.getItem('mail') || '';
    if (this.mail) {
      this.checkTermsAndLoadSuggestions();
    }
  }

  private checkTermsAndLoadSuggestions() {
    this.termsService.getTerms(this.mail).pipe(
      switchMap((accepted: boolean) => {
        this.acceptedTerms = accepted;
        if (!accepted) return of([]); // restituisce array vuoto se non ha accettato
        return this.loadSuggestions();
      }),
      catchError(err => {
        console.error('❌ Errore caricamento termini o suggerimenti:', err);
        return of([]);
      })
    ).subscribe((suggestions: CocktailInterface[]) => {
      this.suggestionsSubject.next(suggestions);
    });
  }

  private loadSuggestions() {
    return this.favoritesService.suggestion(this.mail).pipe(
      switchMap((ids: number[]) => {
        const requests = ids.map(id =>
          this.http.get<any>(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        );
        return forkJoin(requests);
      }),
      switchMap((responses: any[]) => {
        const cocktails: CocktailInterface[] = [];
        responses.forEach((res, index) => {
          if (res.drinks && res.drinks[0]) {
            cocktails.push(res.drinks[0]);
          }
        });
        return of(cocktails);
      })
    );
  }

  getSuggestions(): CocktailInterface[] {
    return this.suggestionsSubject.value;
  }
}
