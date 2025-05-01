import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Message, Share } from "../models/models";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  connectedClients : number = 0;
  public announcementMessage: string = '';
  public dailyIdSubject = new BehaviorSubject<string[]>([]); // accetta un array di stringhe
  mail : string = '';

  dailyId$ = this.dailyIdSubject.asObservable();


  public onClientCountUpdate: ((count: number) => void) | null = null;

  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5001/cocktailHub') // URL del backend
    .build();
    
   this.hubConnection.start().then(() => {
      console.log("SignalR connection started.");
    }).catch((err: any) => console.error("SignalR error:", err));
    this.addListeners();
    this.mail = localStorage.getItem('mail') || '';
    this.hubConnection.invoke("AnnounceUser", this.mail);
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
  
    this.hubConnection.on('ReceiveDailyCocktail', (cocktailId: string[]) => {
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
      .catch((err: any) => console.error("Errore:", err));
  }
  public onDailyCocktailReceived: ((cocktailId: string[]) => void) | null = null;
  
  sendMessage(mail: string, message: string)
  {
    this.hubConnection.invoke("sendMessage", mail, message)
      .catch(err => console.error("Errore:", err));
  }

  receiveMessage(callback: (message: Message) => void) {
    this.hubConnection.on("ReceiveMessage", (msg: Message) => {
      callback(msg);
    });
  }

  receiveAllMessages(callback: (messages: Message[]) => void) {
    this.hubConnection.on("ReceiveAllMessages", (msgs: Message[]) => {
      callback(msgs);
    });
  }
  
  shareCocktail(mail: string, message: string, id: string){
    this.hubConnection.invoke("ShareCocktail", mail, message, id)
      .catch(err => console.error("Errore:", err));
  }
  
  reciveCocktail(callback:(message: Share) => void)
  {
    this.hubConnection.on("ReciveCocktail", (message: Share) => {
      callback(message);
    });
  }

  public startConnection(): Promise<void> {
    return this.hubConnection.start();
  }
  
}
