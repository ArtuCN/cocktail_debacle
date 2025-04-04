import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CreateUser {

  private apiUrl = 'http://localhost:5001/api/user/create';
  constructor(private http: HttpClient) { }
  SendNewUser(us: User): Observable<any> {
    return this.http.post(`${this.apiUrl}`, us);
  }
}
