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
└── README.md