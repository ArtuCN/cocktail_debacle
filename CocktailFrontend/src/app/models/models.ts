

export class User {
    constructor(
      public firstname: string = '',
      public lastname: string = '',
      public mail: string = '',
      public birthdate: Date = new Date(),
      public psw: string = '' // Attenzione: In produzione, mai gestire password in chiaro!
    ) {}
  
    toJson(): Record<string, any> {
      return {
        firstname: this.firstname,
        lastname: this.lastname,
        mail: this.mail,
        birthdate: this.birthdate.toISOString(), // Converti Date in stringa ISO
        psw: this.psw
      };
    }
  
    // Metodo statico per creare un User da dati JSON (es: risposta del backend)
    static fromJson(json: any): User {
      return new User(
        json.firstname,
        json.lastname,
        json.mail,
        new Date(json.birthdate), // Parsa la stringa in Date
        json.psw
      );
    }
  };

  export interface CocktailInterface {
    dateModified: string | null;
    idDrink: string;
    strAlcoholic: string | null;
    strCategory: string | null;
    strCreativeCommonsConfirmed: string | null;
    strDrink: string;
    strDrinkAlternate: string | null;
    strDrinkThumb: string | null;
    strGlass: string | null;
    strIBA: string | null;
    strImageAttribution: string | null;
    strImageSource: string | null;
    strIngredient1: string | null;
    strIngredient2: string | null;
    strIngredient3: string | null;
    strIngredient4: string | null;
    strIngredient5: string | null;
    strIngredient6: string | null;
    strIngredient7: string | null;
    strIngredient8: string | null;
    strIngredient9: string | null;
    strIngredient10: string | null;
    strIngredient11: string | null;
    strIngredient12: string | null;
    strIngredient13: string | null;
    strIngredient14: string | null;
    strIngredient15: string | null;
    strInstructions: string | null;
    strInstructionsES: string | null;
    strInstructionsDE: string | null;
    strInstructionsFR: string | null;
    strInstructionsIT: string | null;
    strInstructionsZH_HANS: string | null;
    strInstructionsZH_HANT: string | null;
    strMeasure1: string | null;
    strMeasure2: string | null;
    strMeasure3: string | null;
    strMeasure4: string | null;
    strMeasure5: string | null;
    strMeasure6: string | null;
    strMeasure7: string | null;
    strMeasure8: string | null;
    strMeasure9: string | null;
    strMeasure10: string | null;
    strMeasure11: string | null;
    strMeasure12: string | null;
    strMeasure13: string | null;
    strMeasure14: string | null;
    strMeasure15: string | null;
    strTags: string | null;
    strVideo: string | null;
}

export interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

export function printCocktailDetails(cocktail: CocktailInterface): void {
  console.log("=== Cocktail Details ===");
  for (const [key, value] of Object.entries(cocktail)) {
      console.log(`${key}: ${value}`);
  }
  console.log(cocktail.idDrink);
}
