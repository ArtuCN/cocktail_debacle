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
  
  constructor(private authService: AuthService, private router: Router) {
    console.log('LoginComponent initialized');
  }
 
  onLoginClick() {
    this.onLogin = !this.onLogin;
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