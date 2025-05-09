// src/app/home/home.component.ts
import { Component, Injectable  } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  birthdate: string = '';
  
  constructor(private authService: AuthService,
    private router: Router
  ) {
    console.log('LoginComponent initialized');
  }
 
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.loggedIn = !!token;
    this.birthdate = localStorage.getItem('birthdate') || '';
  }

  onLoginClick() {
    this.onLogin = !this.onLogin;
  }


  
  testLogin(): void {
    this.authService.login(this.mail, this.password)
      .subscribe({
        next: (res) => {
          // 1) log completo della risposta
          console.log('✅ [testLogin] response:', res);
          // 2) estrai esplicitamente la birthdate
          const bd = (res as any).birthdate;
          console.log('🥳 [testLogin] birthdate to store:', bd);
          // 3) salva in localStorage
          localStorage.setItem('birthdate', bd);
          localStorage.setItem('token', (res as any).token);
          localStorage.setItem('mail', this.mail);
          this.loggedIn = true;
          this.router.navigate(['/home']).then(() => window.location.reload());
        },
        error: err => {
          console.error('❌ [testLogin] Login failed', err);
          this.loginError = 'Invalid login credentials';
        }
      });
  }
  logout(): void {
    this.authService.logout(); // Chiama il metodo di logout del servizio
    this.loggedIn = false; // Imposta loggedIn a false
    this.router.navigate(['/home']); // Naviga alla pagina Home dopo il logout
  }
  
 
}