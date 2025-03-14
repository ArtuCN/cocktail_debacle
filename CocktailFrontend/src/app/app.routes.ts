import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';  // Importa il componente Home
import { CocktailListComponent } from './cocktail-list/cocktail-list.component';  // Importa il componente CocktailList

const routes: Routes = [
  { path: '', component: HomeComponent },  // La Home è la pagina di default
  { path: 'cocktail-list', component: CocktailListComponent }  // La pagina della lista dei cocktail
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
