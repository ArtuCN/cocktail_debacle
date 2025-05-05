import { Component, NgZone } from '@angular/core';
import { Message, Share } from '../models/models';
import { SignalrService } from '../services/signalr.service';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule, Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  m: Message = { sender: '', text: '', timestamp: '' };
  messages: Message[] = [];
  currentShareIndex: number = 0;
  share: Share[] = [];
  isDevelopmentMode = false;
  connectedClients: number = 0;
  mail: string = '';

  constructor(
    private zone: NgZone,
    private location: Location,
    private srs: SignalrService,
    private router: Router
  ) {
    console.log("constructor");
    this.mail = localStorage.getItem('mail') || '';
    if (!this.mail && !this.isDevelopmentMode) return;
    this.m.sender = this.mail;

    if (this.isDevelopmentMode) {
      const mockShare: Share = {
        sender: 'DevBot',
        text: 'Mock cocktail di esempio!',
        timestamp: new Date().toISOString(),
        cocktailId: '11007'
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

  ngOnInit() {
    sessionStorage.removeItem("enteredFromHome");
    this.srs.getCurrentClientCount().then(count => {
      this.zone.run(() => {
        this.connectedClients = count;
      });
    });
    this.srs.receiveAllMessages((allMessages: Message[]) => {
      this.zone.run(() => {
        this.messages = allMessages;
      });
    });
    this.srs.receiveMessage((msg: Message) => {
      this.zone.run(() => {
        this.messages.push(msg);
        this.scrollToBottom();
      });
    });
    this.srs.reciveCocktail((shared: Share) => {
      this.fetchCocktailData(shared);
    });
    this.srs.onClientCountUpdate = (count: number) => {
      this.zone.run(() => {
        this.connectedClients = count;
      });
    };
    this.srs.invokeLoadAllMessages();
  }

  fetchCocktailData(share: Share) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${share.cocktailId}`)
      .then(res => res.json())
      .then(data => {
        const drink = data.drinks?.[0];
        if (drink) {
          share.cocktailName = drink.strDrink;
          share.cocktailImage = drink.strDrinkThumb;
          this.zone.run(() => {
            this.share.push(share);
          });
        }
      })
      .catch(error => console.error("Errore nel recupero cocktail:", error));
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  sendMessage() {
    if (this.m.text.trim() === '') return;
    this.srs.sendMessage(this.mail, this.m.text);
    this.zone.run(() => {
      this.m.text = '';
      this.scrollToBottom();
    });
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
