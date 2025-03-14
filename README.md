-   DB popolato
-   Makefile funzionante
-   Funziona la ricerca da terminale scrivere con  le maiuscole (es: Martini)
-   Sistemare i percorsi in Program.cs in questo momento è un po'hardcodato perchè cocktail.db si trova come suo pari

-   Make disponibile
-   Make clean disponibile

TODO: 
-   Backend
-   Frontend
-   Sistemare make fill


PROBLEMI:
-   Make fill non funziona per il conflitto tra i due program.cs leggere nel file FillingDB/fill.cs
-   Credo manchi il DB di ingredienti ma forse è già possibile filtrare senza di quello
STUDIARE:
-   Come cominciare un minimo di frontend
-   Se il DB in questo momento è già giusto
-   Capire se servono pure gli ingredienti per filtrare



TREE:

.
├── CocktailApp
│   ├── CocktailApp.csproj
│   ├── FillingDB
│   │   ├── CocktailApp.csproj
│   │   └── Fill.cs
│   ├── Program.cs
│   ├── cocktail.db
│   └── cocktail.sql
├── Makefile
├── README.md
├── CocktailFrontend/...


FRONTEND TREE:

my-angular-app/
├── e2e/                        # Test end-to-end
├── node_modules/               # Dipendenze (non versionato in Git)
├── src/                        # Codice sorgente Angular
│   ├── app/                    # Contiene i componenti e i moduli dell'app
│   ├── assets/                 # Risorse statiche (immagini, font, ecc.)
│   ├── environments/           # Variabili di ambiente (configurazione per sviluppo/produzione)
│   ├── index.html              # Punto di ingresso HTML per l'app (il file HTML che carica l'app Angular)
│   ├── styles.css              # Stili globali (opzionale)
├── angular.json                # Configurazione del progetto Angular
├── package.json                # Gestione delle dipendenze e degli script
└── tsconfig.json               # Configurazione TypeScript

DA RENDERE COSI
src/
 └── app/
      ├── home/
      │    ├── home.component.ts
      │    ├── home.component.html
      │    ├── home.component.css
      ├── cocktail-list/
      │    ├── cocktail-list.component.ts
      │    ├── cocktail-list.component.html
      │    ├── cocktail-list.component.css
      ├── app.config.ts       // Configurazioni globali
      ├── app.routes.ts      // Definizione delle rotte
      ├── app.component.ts   // Componente principale
      ├── app.component.html
      ├── app.component.css
      ├── app.module.ts      // Modulo principale