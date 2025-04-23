import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { first } from "rxjs";
import { User } from "../models/models";
import { Subject } from 'rxjs';
import { Message } from "../models/models";
@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  connectedClients : number = 0;
  public announcementMessage: string = '';
  private dailyIdSubject = new Subject<string>();

  dailyId$ = this.dailyIdSubject.asObservable();


  public onClientCountUpdate: ((count: number) => void) | null = null;

  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5001/cocktailHub') // URL del backend
    .build();
    
   this.hubConnection.start().then(() => {
      console.log("SignalR connection started.");
    }).catch(err => console.error("SignalR error:", err));
    this.addListeners();
    this.hubConnection.on("UpdateConnectedClients", (count: number) => {
      this.connectedClients = count;
      console.log("Utenti connessi:", count);
      if (this.onClientCountUpdate) this.onClientCountUpdate(count);
    });
    this.registerOnServerEvents();
  }

  private addListeners() {
    this.hubConnection.on('UserJoined', (message: string) => {
      console.log("📨 Ricevuto da Hub:", message);
      this.announcementMessage = message;
    });
  
    this.hubConnection.on('ReceiveDailyCocktail', (cocktailId: string) => {
      console.log("🍹 Cocktail del giorno ricevuto:", cocktailId);
      this.dailyIdSubject.next(cocktailId); // 👈 aggiorna il campo `daily`
      if (this.onDailyCocktailReceived) {
        this.onDailyCocktailReceived(cocktailId);
      }
    });
  }
  private registerOnServerEvents(): void {
    this.hubConnection.on('UserJoined', (userName: string) => {
      this.announcementMessage = `${userName} si è unito alla community!`;
      console.log('Messaggio ricevuto:', this.announcementMessage);
    });
  }
  announceUser(username: string) {
    this.hubConnection.invoke("AnnounceUser", username)
      .catch(err => console.error("Errore:", err));
  }
  public onDailyCocktailReceived: ((cocktailId: string) => void) | null = null;
  
  sendMessage(mail: string, message: string)
  {
    this.hubConnection.invoke("sendMessage", mail, message)
      .catch(err => console.error("Errore:", err));
  }

  receiveMessage(callback: (message: Message) => void) {
    this.hubConnection.on("ReceiveMessage", (sender: string, msg: any) => {
      const message: Message = {
        sender: sender,
        text: msg.message,
        timestamp: msg.timestamp
      };
      callback(message);
    });
  }
  
  
    //per la chat
}
