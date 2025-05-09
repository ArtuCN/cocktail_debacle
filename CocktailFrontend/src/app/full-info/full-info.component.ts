import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CocktailInterface } from '../models/models';
import { CommonModule, getLocaleTimeFormat } from '@angular/common'; // necessario se standalone
import { FormsModule } from '@angular/forms';
import { SignalrService } from '../services/signalr.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-full-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './full-info.component.html',
  styleUrls: ['./full-info.component.css']
})
export class FullInfoComponent implements OnInit {
  cocktail: CocktailInterface = {} as CocktailInterface;
  selectedLanguage: string = 'EN';
  selectedLang: keyof CocktailInterface = 'strInstructions';
  showLanguages: boolean = false;
  
  availableLanguages: { label: string; key: keyof CocktailInterface, flag: string }[] = [
    { label: 'English', key: 'strInstructions', flag: 'uk.png' },
    { label: 'Italiano', key: 'strInstructionsIT', flag: 'it.png' },
    { label: 'Español', key: 'strInstructionsES', flag: 'es.png' },
    { label: 'Deutsch', key: 'strInstructionsDE', flag: 'de.png' },
    { label: 'Français', key: 'strInstructionsFR', flag: 'fr.png' },
    { label: '中文 (Semplificato)', key: 'strInstructionsZH_HANS', flag: 'ch.png' },
    { label: '中文 (Tradizionale)', key: 'strInstructionsZH_HANT', flag: 'tw.png' }
  ];
  ingredients: string[] = [];
  selectedCocktail: any = null;
  message: string = '';
  mail: string = '';
  currentFlag: string = '';  // Variabile per contenere la bandiera da visualizzare
  name: string = '';
  ingredientDetails: { ingredient: string; measure: string }[] = [];

  constructor(private http: HttpClient,
    private srs: SignalrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.name = sessionStorage.getItem('cocktailId') ?? '';
    sessionStorage.removeItem('cocktailId');
    this.mail = localStorage.getItem('mail') ?? '';
    
    if (this.name == '')
    {
      this.router.navigate(['/home']);
      window.location.reload();
      return;
    }

    this.http
      .get<{ drinks: CocktailInterface[] }>('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + this.name)
      .subscribe({
        next: (data: { drinks: CocktailInterface[] }) => {
          if (data.drinks && data.drinks.length > 0) {
            this.cocktail = data.drinks[0];
            this.loadCocktailDetails(this.cocktail);
          }
        },
        error: (err: any) => {
          console.error('Error ', err);
        }
      });
  }
    
    toggleLanguageMenu(): void {
      this.showLanguages = !this.showLanguages;
    }
    
    missMail(): boolean
    {
      if (this.mail == '')
        return false;
      return true;
    }

    video(): boolean {
      if (this.cocktail.strVideo == null)
        return false;
      return true;
    }

  goBack(): void {
    this.router.navigate(['/home']);
  }

    shareCocktail()
    {
      if (this.mail == '')
        return;
      this.srs.shareCocktail(this.mail, this.message, this.cocktail.idDrink);
      this.goToChat();
    }
    loadCocktailDetails(cocktail: any) {
      this.selectedCocktail = cocktail;
      this.ingredientDetails = [];
    
      for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
    
        if (ingredient) {
          this.ingredientDetails.push({
            ingredient: ingredient.trim(),
            measure: measure ? measure.trim() : ''
          });
        }
      }
    }
    
    getIngredientImageUrl(ingredient: string): string {
      const baseUrl = 'https://www.thecocktaildb.com/images/ingredients/';
      let ingredientName = ingredient.toLowerCase().replace(/\s+/g, '%20');
      return `${baseUrl}${ingredientName}-small.png`;
    }
    
    
  setLanguage(lang: keyof CocktailInterface): void {
    this.selectedLang = lang;
    const selectedLanguage = this.availableLanguages.find(l => l.key === lang);
    if (selectedLanguage) {
      this.currentFlag = selectedLanguage.flag;  // Aggiorna la bandiera corrente
    }
  }

  getInstruction(): string | null {
    const lang = this.availableLanguages.find(lang => lang.label.toUpperCase().includes(this.selectedLanguage.toUpperCase()));
    return lang ? this.cocktail[lang.key] : null;
  }
  getFlag(langKey: keyof CocktailInterface): string {
    const language = this.availableLanguages.find(l => l.key === langKey);
    return language ? language.flag : '';
  }
  goToChat() {
    sessionStorage.setItem("enteredFromHome", "true");
    this.router.navigate(['/chat']);
  }
}