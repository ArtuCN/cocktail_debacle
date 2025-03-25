import { Injectable } from '@angular/core';
import { url} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  constructor() { }

  searchbyname(name: string): void {
    fetch(url + name, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nella risposta del server');
        }
        return response.json();
      })
      .then(data => {
        console.log('Dati ricevuti:', data);  // Gestisci i dati ricevuti
        // Passa i dati al componente o servizio
      })
      .catch(error => {
        console.error('Errore nella richiesta:', error);
      });
  }
  
  
}
