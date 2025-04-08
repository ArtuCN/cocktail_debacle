

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
    IdDrink: string;
    StrDrink: string;
    StrDrinkAlternate: string | null;
    StrTags: string | null;
    StrVideo: string | null;
    StrCategory: string | null;
    StrIBA: string | null;
    StrAlcoholic: string | null;
    StrGlass: string | null;
    StrInstructions: string | null;
    StrInstructionsES: string | null;
    StrInstructionsDE: string | null;
    StrInstructionsFR: string | null;
    StrInstructionsIT: string | null;
    StrInstructionsZH_HANS: string | null;
    StrInstructionsZH_HANT: string | null;
    StrDrinkThumb: string | null;
    StrIngredient1: string | null;
    StrIngredient2: string | null;
    StrIngredient3: string | null;
    StrIngredient4: string | null;
    StrIngredient5: string | null;
    StrIngredient6: string | null;
    StrIngredient7: string | null;
    StrIngredient8: string | null;
    StrIngredient9: string | null;
    StrIngredient10: string | null;
    StrIngredient11: string | null;
    StrIngredient12: string | null;
    StrIngredient13: string | null;
    StrIngredient14: string | null;
    StrIngredient15: string | null;
    StrMeasure1: string | null;
    StrMeasure2: string | null;
    StrMeasure3: string | null;
    StrMeasure4: string | null;
    StrMeasure5: string | null;
    StrMeasure6: string | null;
    StrMeasure7: string | null;
    StrMeasure8: string | null;
    StrMeasure9: string | null;
    StrMeasure10: string | null;
    StrMeasure11: string | null;
    StrMeasure12: string | null;
    StrMeasure13: string | null;
    StrMeasure14: string | null;
    StrMeasure15: string | null;
    StrImageSource: string | null;
    StrImageAttribution: string | null;
    StrCreativeCommonsConfirmed: string | null;
    dateModified: string | null;
}
  