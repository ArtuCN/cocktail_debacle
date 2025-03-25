import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Assicurati che il servizio sia globalmente disponibile
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<string>('');  // Un comportamento iniziale vuoto
  errorMessage$ = this.errorSubject.asObservable();  // Rende visibile l'errore tramite un observable

  setError(message: string): void {
    this.errorSubject.next(message);  // Aggiorna il messaggio di errore
  }
}
