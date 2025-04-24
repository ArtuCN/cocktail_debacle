// src/app/home/home.component.ts
import { Component, Injectable, importProvidersFrom  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  // Inietta HttpClient come servizio
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Aggiungi ErrorComponent nelle imports
  providers: [AuthService],
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})
export class LoginComponent {


  mail: string = '';
  password: string = '';
  loginError: string = '';
  onLogin: boolean = false;
  loggedIn: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {
    console.log('LoginComponent initialized');
  }
 
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.loggedIn = !!token;
  }

  onLoginClick() {
    this.onLogin = !this.onLogin;
  }


  
  testLogin(): void {
    const isAdmin = this.mail === 'admin@admin.com';
    if (isAdmin == true)
    {
      this.password == "psw";
      this.router.navigate(['/admin']);
    }
    this.authService.login(this.mail, this.password).subscribe({

      next: (response) => {
        localStorage.setItem('token', response.token); // Salva il token nel localStorage
        localStorage.setItem('mail', this.mail);
        this.loggedIn = true; // Imposta loggedIn a true
        console.log('Login successful', response);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loginError = 'Invalid login credentials';
      }
    });
  }
  logout(): void {
    this.authService.logout(); // Chiama il metodo di logout del servizio
    this.loggedIn = false; // Imposta loggedIn a false
    this.router.navigate(['/home']); // Naviga alla pagina Home dopo il logout
  }
  
  onLoginSubmit(event: Event) {
    event.preventDefault();
    console.log('Login attempted with mail:', this.mail, 'password:', this.password);

    this.authService.login(this.mail, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.loginError = '';
        this.router.navigate(['/home']);  // Naviga alla pagina Home dopo il login
      },
      error => {
        console.error('Login error', error);
        this.loginError = error.message;  // Mostra errore in caso di credenziali errate
      }
    );
  }
}