export class adminUserInfo
{
  constructor(
    public id: string,
    public userName: string = '',
    public mail: string = '',
    public birthDate: string = '',
    public hasAccepted: boolean,
    public isOnline: boolean = false
  ){}
};

export class User {
    constructor(
      public username: string = '',
      public mail: string = '',
      public birthdate: Date = new Date(),
      public psw: string = '',
      public acceptterms: boolean = false
    ) {}
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

export interface MessageAdmin {
  sender: string;
  messageText: string;
  timestamp: string;
  id: string;
}

export interface Share
{
  sender: string;
  text: string;
  timestamp: string;
  cocktailId: string;

  cocktailName?: string;
  cocktailImage?: string;
}

export function printCocktailDetails(cocktail: CocktailInterface): void {
  for (const [key, value] of Object.entries(cocktail)) {
      console.log(`${key}: ${value}`);
  }
}
