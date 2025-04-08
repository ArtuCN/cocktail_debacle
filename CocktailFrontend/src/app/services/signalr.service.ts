import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { first } from "rxjs";
import { User } from "../models/models";

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

    private hubConnection: signalR.HubConnection;
    constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5001/cocktailHub') // URL del backend
      .build();

    this.startConnection();
    }

    private startConnection(){

        this.hubConnection.start().then(() => {
            console.log('Connection started');
        }).catch(err => console.log('Error while starting connection: ' + err));
    }
    //per la chat
}
