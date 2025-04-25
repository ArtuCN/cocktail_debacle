import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TermsService {
  apiUrl = '';
   
  constructor(private http: HttpClient) { }

  getTerms(mail: string): Observable<any> {
    const apiUrl = `http://localhost:5001/api/user/${mail}/terms`;
    return this.http.get<any>(apiUrl);
  }
  
}
