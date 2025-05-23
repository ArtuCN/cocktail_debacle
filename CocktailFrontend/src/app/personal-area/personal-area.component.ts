import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth.service';
import { TermsService } from '../services/terms.service';
import { catchError, map, of } from 'rxjs';

interface UserData {
  username: string;
  mail: string;
  birthdate: string;
}

interface JwtPayload {
  name: string;
}

@Component({
  selector: 'app-personal-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-area.component.html',
  //styleUrl: './personal-area.component.css'
})
export class PersonalAreaComponent implements OnInit {

  userData: UserData = {
    username: '',
    mail: '',
    birthdate: ''
  };

  admin: boolean = false;
  mail: string = '';
  name: string = '';
  loggedIn: boolean = true;//loggato o no
  isEditing = false;
  isDevelopmentMode = false; // Modalità di sviluppo
  termsAccepted = false; // Accettazione dei termini

  constructor(private http: HttpClient,
    public router: Router,
    private authService: AuthService,
    private termsService: TermsService
  ) { }

  ngOnInit(): void {
    if (this.isDevelopmentMode) {
      // Dati fittizi per lo sviluppo
      this.userData = {
        username: 'Utente Test',
        mail: 'test@example.com',
        birthdate: '1990-01-01'
      };
      return; // Salta il controllo di autenticazione
    }
    const token = localStorage.getItem('token');
    const mail = localStorage.getItem('mail');
    
    if (!mail) {
      
      this.router.navigate(['/home']);
      window.location.reload();
      return;
    }

    this.userData.mail = mail;
    
    if (this.loggedIn) {
      // Decodifica il token per ottenere il nome dell'utente
      const decodedToken: any = jwtDecode(token as string); // decodifica il token
      this.name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];  // Estrarre il nome
      if (this.userData.mail === 'admin@admin.com')
        this.admin = true;
    }
    
    this.termsService.getTerms(this.userData.mail).pipe(
      map((response: boolean) => {
        this.termsAccepted = response;
      }),
      catchError((error) => {
        console.error('Error', error);
        return of(null);
      })
    ).subscribe();
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        if (username) {
          this.userData.username = username;
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
    
    // Carica i dati completi dal server
    this.loadUserData();
  }


  toggleTermsAccepted(): void {
    this.termsAccepted = !this.termsAccepted;
    this.http.put(`/api/user/${this.userData.mail}/terms`, {accepted: this.termsAccepted }).subscribe();
  }

  loadUserData(): void {
    const apiUrl = `http://localhost:5001/api/user/${this.userData.mail}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        const birthdate = new Date(data.birthdate);
        this.userData = {
          username: data.username || this.userData.username || '',
          mail: data.mail || this.userData.mail || '',
           birthdate: data.birthdate || this.userData.birthdate || ''
        };
      },
      error: (err) => {
        console.error('Error', err);
      }
    });
  }

  saveUserData(): void {
    const apiUrl = `http://localhost:5001/api/user/${this.userData.mail}`;
    
    this.http.put<any>(apiUrl, this.userData).subscribe({
      next: () => {
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('mail');
    this.router.navigate(['/home']);
  }
}