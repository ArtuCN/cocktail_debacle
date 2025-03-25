// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { ErrorComponent } from "../error/error.component";  // Importa il servizio di errori
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ErrorComponent], // Aggiungi ErrorComponent nelle imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private errorService: ErrorService) {}

  // Funzione per inviare un errore quando il bottone viene cliccato
  sendError(): void {
    this.errorService.setError('Something went wrong on the Home page!');
  }
}
