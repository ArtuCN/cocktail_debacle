import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Message, Share } from "../models/models";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  connectedClients: number = 0;
  public announcementMessage: string = '';
  public dailyIdSubject = new BehaviorSubject<string[]>([]);
  mail: string = '';

  dailyId$ = this.dailyIdSubject.asObservable();

  public onClientCountUpdate: ((count: number) => void) | null = null;
  public onDailyCocktailReceived: ((cocktailId: string[]) => void) | null = null;

  private hubConnection: signalR.HubConnection;

  constructor() {
    this.mail = localStorage.getItem('mail') || '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5001/cocktailHub') // URL del backend
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log("✅ SignalR connection started.");
        this.hubConnection.invoke("AnnounceUser", this.mail);
        this.addListeners();
      })
      .catch(err => console.error("❌ SignalR error:", err));
  }

  private addListeners() {
    this.hubConnection.on("UpdateConnectedClients", (count: number) => {
      this.connectedClients = count;
      if (this.onClientCountUpdate) this.onClientCountUpdate(count);
    });

    this.hubConnection.on("UserJoined", (message: string) => {
      if (this._userJoinedCallback) {
        this._userJoinedCallback(message);
      }
    });

    this.hubConnection.on("ReceiveDailyCocktail", (cocktailIds: string[]) => {
      this.dailyIdSubject.next(cocktailIds);
      if (this.onDailyCocktailReceived) {
        this.onDailyCocktailReceived(cocktailIds);
      }
    });
    this.hubConnection.on("ReceiveMessage", (msg: Message) => {
      if (this._receiveMessageCallback) {
        this._receiveMessageCallback(msg);
      }
    });
    this.hubConnection.on("ReceiveAllMessages", (msgs: Message[]) => {
      if (this._receiveAllMessagesCallback) {
        this._receiveAllMessagesCallback(msgs);
      }
    });
    this.hubConnection.on("ReciveCocktail", (message: Share) => {
      if (this._receiveCocktailCallback) {
        this._receiveCocktailCallback(message);
      }
    });
  }

  announceUser(username: string) {
    this.hubConnection.invoke("AnnounceUser", username)
      .catch(err => console.error("❌ Error ", err));
  }

  sendMessage(mail: string, message: string) {
    this.hubConnection.invoke("sendMessage", mail, message)
      .catch(err => console.error("❌ Error ", err));
  }

  private _receiveMessageCallback: ((message: Message) => void) | null = null;

  receiveMessage(callback: (message: Message) => void) {
    this._receiveMessageCallback = callback;
  }

  private _reminderToLoginCallback: ((user: string, message: string) => void) | null = null;
  reminderToLogin(callback: (user: string, message: string) => void) {
    this._reminderToLoginCallback = callback;
  }

  private _userJoinedCallback: ((message: string) => void) | null = null;
  userJoined(callback: (message: string) => void) {
    this._userJoinedCallback = callback;
  }

  getConnectedClients() {
    this.hubConnection.invoke("SendConnectedClientsCount")
      .catch(err => console.error("❌ Errore getConnectedClients:", err));
  }

  getCurrentClientCount(): Promise<number> {
  return this.hubConnection.invoke<number>('GetConnectedClientCount');
}

  private _receiveAllMessagesCallback: ((messages: Message[]) => void) | null = null;
  receiveAllMessages(callback: (messages: Message[]) => void) {
    this._receiveAllMessagesCallback = callback;
  }

  shareCocktail(mail: string, message: string, id: string) {
    this.hubConnection.invoke("ShareCocktail", mail, message, id)
      .catch(err => console.error("❌ Error", err));
  }

  private _receiveCocktailCallback: ((message: Share) => void) | null = null;
  reciveCocktail(callback: (message: Share) => void) {
    this._receiveCocktailCallback = callback;
  }

  invokeLoadAllMessages() {
    this.hubConnection.invoke("SendAllMessagesToCaller")
      .catch(err => console.error("❌ Error", err));
  }
  

  public startConnection(): Promise<void> {
    return this.hubConnection.start();
  }
}
