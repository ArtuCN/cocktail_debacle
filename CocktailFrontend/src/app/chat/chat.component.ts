import { Component } from '@angular/core';
import { Message, Share } from '../models/models';
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
    this.srs.reciveCocktail((shared: Share) => {
      this.fetchCocktailData(shared);
    });
  }
  m: Message = { sender: '', text: '',  timestamp: ''};
  messages: Message[] = [];
  share: Share[] = [];
  
  constructor(private location: Location, private srs: SignalrService) 
  {
    this.m.sender = localStorage.getItem('mail') || '';
    if (this.m.sender == '')
      this.goBack();
  }
  fetchCocktailData(share: Share)
  {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${share.cocktailId}`)
    .then(res => res.json())
    .then(data => {
      const drink = data.drinks?.[0];
      if (drink) {
        share.cocktailName = drink.strDrink;
        share.cocktailImage = drink.strDrinkThumb;
        this.share.push(share);
      }
    })
    .catch(error => console.error("Errore nel recupero cocktail:", error));
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
