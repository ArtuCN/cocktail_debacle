import { Component, Inject, Injectable } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { User } from '../models/models';
import { CreateUser } from '../services/createuser.service';
import { userInfo } from 'node:os';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  providers: [CreateUser],
  templateUrl: './create-user.component.html',
  //styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  constructor (private cs: CreateUser) { }
  us: User = new User();
  message : string = '';

  newUser(): void {
    this.message = ''
    if (!this.checkMailInfo(this.us.mail))
    {
      this.message = 'Error invalid mail';
      return;
    }
    this.cs.SendNewUser(this.us).subscribe({
      next: (response) => {
        this.message = 'User created successfully!';
      },
      error: (error) => {
        this.message = 'Error creating user';
      },
    });
  }

  checkMailInfo(Mail: string): boolean
  {
    const forbiddenChars =/[\\'"*+/()<>;:{}[\]\=àèéìòù|]/;
    if (Mail.length == 0)
      return false;
    if (!Mail.includes('@'))
        return false;
    if (forbiddenChars.test(Mail))
      return false;
    return true;
  }
}
