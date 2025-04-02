import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { CocktailResearchComponent } from './cocktail-research/cocktail-research.component'; // Aggiungi il componente di ricerca

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '**', redirectTo: 'home'},
    {path: 'cocktail-research', component: CocktailResearchComponent},
    {path: 'error', component: ErrorComponent},
];

export const appRouter = RouterModule.forRoot(routes);