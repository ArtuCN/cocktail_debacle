import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { adminUserInfo } from '../models/models';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MessageAdmin } from '../models/models';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class ADMINPAGEComponent {
 
  users: adminUserInfo[] = [];
  messages: MessageAdmin[] =[];
  showUsers: boolean = true;
  showMessages: boolean = true;
  constructor(private http: HttpClient, private router: Router) {}
  mail: string = '';

  ngOnInit(): void {
    this.showAllUsers();
    this.getAllMessages();
    this.mail = localStorage.getItem('mail') || '';
    if (this.mail !== 'admin@admin.com') { 
      this.router.navigate(['/home']); // Reindirizza alla home se non è admin
      return; 
    }
  }
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
        this.users = this.users.filter(user => user.userName !== usermame);
      },
      error: (err) => {
        console.error(`Errore durante l'eliminazione dell'utente con usermame ${usermame}:`, err);
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }

  getAllMessages(){
    this.http.get<MessageAdmin[]>('http://localhost:5001/api/admin/messages').subscribe((res: MessageAdmin[])=> {
      this.messages = res; 
    });
  }

  deleteMessage(id: number) {
    this.http.delete(`http://localhost:5001/api/admin/messages/${id}`).subscribe({
      next: () => {
        this.getAllMessages();
      },
      error: (err) => {
        console.error('Failed to delete message', err);
      }
    });
  }
}
