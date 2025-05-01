import { Component } from '@angular/core';
import { Message, Share } from '../models/models';
import { SignalrService } from '../services/signalr.service';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule, Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
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
    this.srs.onClientCountUpdate = (count: number) => {
      this.connectedClients = count;
    };
  }
  m: Message = { sender: '', text: '',  timestamp: ''};
  messages: Message[] = [];
  currentShareIndex: number = 0;
  share: Share[] = [];
  isDevelopmentMode = false;
  connectedClients: number = 0;
  mail: string = '';



  constructor(private location: Location, private srs: SignalrService) 
  {
    
    this.mail = localStorage.getItem('mail') || '';
    if (!this.mail && !this.isDevelopmentMode)
      return;
    this.m.sender = this.mail;
    if (this.isDevelopmentMode) {
      const mockShare: Share = {
        sender: 'DevBot',
        text: 'Mock cocktail di esempio!',
        timestamp: new Date().toISOString(),
        cocktailId: '11007' // Margarita (esempio reale di ID di TheCocktailDB)
      };
  
      this.fetchCocktailData(mockShare);
    }
        
    this.srs.dailyId$.subscribe(ids => {
      ids.forEach(id => {
        this.fetchCocktailData({
          sender: 'CocktailBot',
          text: 'Daily-Cocktails!',
          timestamp: new Date().toISOString(),
          cocktailId: id
        });
      });
    });
    
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
    console.log("mail inviata ", this.mail);
    this.srs.sendMessage(this.mail, this.m.text);
    let i: number = 0;
    while (i++ < 10)
      console.log(this.messages[i]);
    this.m.text = '';
  }


  scrollToBottom() {
    const chatDiv = document.querySelector('.messages');
    chatDiv?.scrollTo({ top: chatDiv.scrollHeight, behavior: 'smooth' });
  }

  get currentShare(): Share | null {
    return this.share.length > 0 ? this.share[this.currentShareIndex] : null;
  }

  nextShare() {
    if (this.currentShareIndex < this.share.length - 1) {
      this.currentShareIndex++;
    }
  }

  prevShare() {
    if (this.currentShareIndex > 0) {
      this.currentShareIndex--;
    }
  }
}
