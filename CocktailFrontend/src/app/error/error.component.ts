import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  providers: [ErrorService], // Aggiungi ErrorService nelle imports
  templateUrl: './error.component.html',
  //styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  errorMessage: string = '';

  constructor(private es: ErrorService) {}

  ngOnInit(): void {
    // Sottoscrizione al messaggio di errore
    this.es.errorMessage$.subscribe((message) => {
      this.errorMessage = message;
    });
  }
}
