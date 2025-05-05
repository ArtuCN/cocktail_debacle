import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { adminUserInfo } from '../models/models';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { elementAt } from 'rxjs';
@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, NgFor],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class ADMINPAGEComponent {
 
  users: adminUserInfo[] = [];
  constructor(private http: HttpClient)
  {
    this.showAllUsers();
  };
  showAllUsers() {
    this.http.get<adminUserInfo[]>("http://localhost:5001/api/admin/users").subscribe((res: adminUserInfo[]) => {
      console.log("Utenti ricevuti dal backend:", res);
  
      this.users = res.map((element: adminUserInfo) => {
        return {
          ...element,
          hasAccepted: element.hasAccepted === true,
          isOnline: element.isOnline === true
        };
      });
  
      console.log("Utenti processati:", this.users);
    });
  }
  
  kickUser(usermame: string) {
    console.log("Elimina utente con ID:", usermame);
    this.http.delete(`http://localhost:5001/api/admin/kickout/${usermame}`).subscribe({
      next: () => {
        console.log(`Utente con ID ${usermame} eliminato con successo.`);
        this.users = this.users.filter(user => user.userName !== usermame);
      },
      error: (err) => {
        console.error(`Errore durante l'eliminazione dell'utente con usermame ${usermame}:`, err);
      }
    });
  }
}
