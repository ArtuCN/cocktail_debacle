import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { first } from "rxjs";
import { User } from "../models/models";

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  connectedClients : number = 0;
  public onClientCountUpdate: ((count: number) => void) | null = null;

  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5001/cocktailHub') // URL del backend
    .build();
    
   this.hubConnection.start().then(() => {
      console.log("SignalR connection started.");
    }).catch(err => console.error("SignalR error:", err));

    this.hubConnection.on("UpdateConnectedClients", (count: number) => {
      this.connectedClients = count;
      console.log("Utenti connessi:", count);
      if (this.onClientCountUpdate) this.onClientCountUpdate(count);
    });
  }
    //per la chat
}
