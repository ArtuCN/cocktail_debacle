import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CocktailInterface } from '../models/models';
import { CommonModule } from '@angular/common'; // necessario se standalone
import { FormsModule } from '@angular/forms';

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

  currentFlag: string = '';  // Variabile per contenere la bandiera da visualizzare

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<{ drinks: CocktailInterface[] }>('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11004')
      .subscribe({
        next: (data: { drinks: CocktailInterface[] }) => {
          if (data.drinks && data.drinks.length > 0) {
            this.cocktail = data.drinks[0];
            console.log(this.cocktail.strDrink);
            this.loadCocktailDetails(this.cocktail); // ✅ chiamiamolo subito
          }
        },
        error: (err: any) => {
          console.error('Errore durante il fetch del cocktail:', err);
        }
      });
  }
  
    
    toggleLanguageMenu(): void {
      this.showLanguages = !this.showLanguages;
    }
    
    loadCocktailDetails(cocktail: any) {
      console.log("loadCocktailDetails");
      this.selectedCocktail = cocktail;
      this.ingredients = [];
    
      for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
    
        if (ingredient) {
          const fullIngredient = `${ingredient}`.trim();
          this.ingredients.push(fullIngredient);
          console.log(`Ingrediente ${i}:`, fullIngredient);
        }
      }
    
      console.log("Ingredienti finali:", this.ingredients);
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
  
}
