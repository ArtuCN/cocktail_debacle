import { Component, Inject, Injectable } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { User } from '../models/models';
import { CreateUser } from '../services/createuser.serice';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  constructor (private cs: CreateUser) { }
  us: User = new User();
  message : string = '';

  newUser(): void {
    this.cs.SendNewUser(this.us).subscribe({
      next: (response) => {
        this.message = 'User created successfully!';
      },
      error: (error) => {
        this.message = 'Error creating user';
      },
    });
  }
}
