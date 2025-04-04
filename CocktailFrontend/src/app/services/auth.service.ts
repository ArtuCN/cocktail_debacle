import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5001/api/user/login';
  constructor(private http: HttpClient) { }
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(this.apiUrl, loginData);
  }
}
