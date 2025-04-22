import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5001/api/user/login';
  constructor(private http: HttpClient) { }
  login(Mail: string, Psw: string): Observable<any> {
    const loginData = { Mail, Psw };
    return this.http.post<{ token: string }>(this.apiUrl, loginData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Salva il token nel localStorage
      }),
    );
  }


  
  logout(): void {
    localStorage.removeItem('token'); // Rimuove il token dal localStorage
  }
}
