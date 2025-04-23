import { Component } from '@angular/core';
import { Message } from '../models/models';
import { SignalrService } from '../services/signalr.service';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule, Location } from '@angular/common';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  ngOnInit() {
    this.srs.receiveMessage((msg: Message) => {
      this.messages.push(msg);
    });
  }
  m: Message = { sender: '', text: '',  timestamp: ''};
  messages: Message[] = [];
  constructor(private location: Location, private srs: SignalrService) 
  {
    this.m.sender = localStorage.getItem('mail') || '';
    if (this.m.sender == '')
      this.goBack();
    this.srs.receiveMessage((msg: Message) => {
      this.messages.push(msg);
    });
  }
  goBack(): void {
    this.location.back();
  }
  sendMessage()
  {
    if (this.m.text.trim() === '') return;
    this.srs.sendMessage(this.m.sender, this.m.text);
    let i: number = 0;
    while (i++ < 10)
      console.log(this.messages[i]);
    this.m.text = '';
  }

  scrollToBottom() {
    const chatDiv = document.querySelector('.messages');
    chatDiv?.scrollTo({ top: chatDiv.scrollHeight, behavior: 'smooth' });
  }

}
