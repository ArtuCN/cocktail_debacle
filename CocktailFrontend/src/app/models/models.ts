export class User {
    constructor(
      public firstname: string,
      public lastname: string,
      public mail: string,
      public birthdate: Date,
      public psw: string  // Attenzione: In produzione, mai gestire password in chiaro!
    ) {}
  
    // Metodo utile per inviare dati al backend
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

  export interface Cocktail {
    id: number;
    name: string;
    category: string;
    alcoholic: string;
    glass: string;
    instructions: string;
    imageUrl: string;
    ingredients: string[];
  }