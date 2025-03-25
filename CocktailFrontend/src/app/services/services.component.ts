import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:5001/api/test'; // URL del backend

  constructor(private http: HttpClient) {}

  getMessage(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(this.apiUrl);
  }
}
