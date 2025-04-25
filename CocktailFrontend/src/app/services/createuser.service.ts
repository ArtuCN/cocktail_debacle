import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class CreateUser {

  private apiUrl = 'http://localhost:5001/api/user/create';
  constructor(private http: HttpClient, private ssr: SignalrService) { }
  SendNewUser(us: User): Observable<any> {
    return this.http.post(`${this.apiUrl}`, us).pipe(
      tap(() => {
        // Dopo la creazione, annuncia l’utente
        this.ssr.announceUser(us.username); // o us.email o qualsiasi campo
      })
    );
  }
}
