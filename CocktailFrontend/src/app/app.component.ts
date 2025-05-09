import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CreateUserComponent } from './create-user/create-user.component';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ], // Aggiungi ErrorComponent nelle imports
  template: `
    <router-outlet></router-outlet> <!-- Questo gestisce le rotte dinamiche -->
    `,
  //styleUrls: ['../styles.css']  // Assicurati di usare styleUrls (con "s" alla fine)
})



export class AppComponent {
  title = 'CocktailDebacle';
}
