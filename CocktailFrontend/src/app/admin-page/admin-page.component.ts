import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
@Component({
  selector: 'app-admin-page',
  imports: [],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class ADMINPAGEComponent {
  
  constructor(private http: HttpClient)
  {
    this.showAllUsers();
  };
  showAllUsers()
  {
    this.http.get("http://localhost:5001/api/admin/users").subscribe((res) => {
    console.log("Utenti:", res);
  });

  }
  kickUser()
  {

  }
}
