import { Injectable } from '@angular/core';
import { url} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  constructor() { }

  searchbyname(name: string): void {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Specifica che stai inviando dati in formato JSON
      },
      body: JSON.stringify(name)  // Invia il nome come stringa nel corpo della richiesta
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Response Error');
        }
        return response.json();
      })
      .then(data => {
        console.log('Recived:', data);  // Gestisci i dati ricevuti
        // Passa i dati al componente o servizio
      })
      .catch(error => {
        console.error('Request Error', error);
      });
  }
  
  
}
