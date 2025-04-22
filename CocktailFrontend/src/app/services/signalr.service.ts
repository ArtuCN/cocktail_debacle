import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { first } from "rxjs";
import { User } from "../models/models";

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  connectedClients : number = 0;
  public announcementMessage: string = '';

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
  
    //per la chat
}
