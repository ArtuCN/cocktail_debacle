import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component'; // Importa il componente Home
import { CocktailListComponent } from './cocktail-list/cocktail-list.component'; // Importa il componente CocktailList
import { ErrorComponent } from './error/error.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CocktailListComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
