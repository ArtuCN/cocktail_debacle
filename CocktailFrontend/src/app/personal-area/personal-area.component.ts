import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface UserData {
  username: string;
  mail: string;
  birthdate: string;
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

  isEditing = false;

  constructor(private http: HttpClient,
    public router: Router
  ) { }

  ngOnInit(): void {
    const mail = localStorage.getItem('mail');
    if (!mail) {
      this.router.navigate(['/home']);
      return;
    }

    this.userData.mail = mail;
    this.loadUserData();
  }

  loadUserData(): void {
    const apiUrl = `http://localhost:5001/api/user/${this.userData.mail}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.userData = {
          username: data.username || '',
          mail: data.mail || '',
          birthdate: data.birthdate || ''
        };
      },
      error: (err) => {
        console.error('❌ Errore nel recupero dei dati utente:', err);
      }
    });
  }

  saveUserData(): void {
    const apiUrl = `http://localhost:5001/api/user/${this.userData.mail}`;
    
    this.http.put<any>(apiUrl, this.userData).subscribe({
      next: () => {
        console.log('✅ Dati utente aggiornati con successo');
        this.isEditing = false;
      },
      error: (err) => {
        console.error('❌ Errore durante l\'aggiornamento dei dati utente:', err);
      }
    });
  }
}
