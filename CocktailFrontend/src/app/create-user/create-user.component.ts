import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {

  constructor(private rs: SignalrService) { }
  user = { mail: '', firstname: '', lastname: '', psw: '', birthdate: new Date() };
  message : string = '';

  newUser(): void {
    this.message = `User ${this.user.firstname} ${this.user.lastname} created successfully!`;
    console.log(`🔍 component CREATE request for: ${this.user.firstname} ${this.user.lastname} ${this.user.mail} ${this.user.birthdate} ${this.user.psw}`);
    this.rs.createUser(
      this.user.firstname, 
      this.user.lastname, 
      this.user.mail, 
      this.user.birthdate, // Converte la stringa in Date, se necessario
      this.user.psw
    );
  };
  
}
