import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';  // Importa il componente Home
import { CocktailListComponent } from './cocktail-list/cocktail-list.component';  // Importa il componente CocktailList
import { ErrorComponent } from './error/error.component'; 

const routes: Routes = [
  { path: '', component: HomeComponent },  // La Home è la pagina di default
  { path: 'home', component: HomeComponent },  // La pagina Home
  { path: 'cocktail-list', component: CocktailListComponent },  // La pagina CocktailList
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
