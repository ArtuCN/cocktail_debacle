// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CocktailListComponent } from './cocktail-list/cocktail-list.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cocktails', component: CocktailListComponent }
];
