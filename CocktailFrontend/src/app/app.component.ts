import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ErrorComponent } from './error/error.component'; // Importa il componente di errore
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorComponent, CommonModule], // Aggiungi ErrorComponent nelle imports
  template: `
    <router-outlet></router-outlet> <!-- Questo gestisce le rotte dinamiche -->
    <app-error></app-error> <!-- Mostra il componente di errore -->
  `,
  styleUrls: ['../styles.css']  // Assicurati di usare styleUrls (con "s" alla fine)
})



export class AppComponent {
  title = 'CocktailFrontend';
}
