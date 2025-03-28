import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { url } from "../app.config";

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
    searchbyname(name: string): void {
        console.log(`🔍 Sending search request for: ${name}`);
        this.hubConnection
          .invoke('SearchCocktailByName', name)
          .catch((err) => console.error('Errore durante l\'invio del nome del cocktail:', err));
    }
    // Metodo per ricevere i cocktail dal backend
   onReceiveCocktails(callback: (cocktails: any[]) => void): void {
        this.hubConnection.on('ReceiveCocktails', callback);
    }

    // Metodo per ascoltare errori
    onReceiveError(callback: (error: string) => void): void {
        this.hubConnection.on('ReceiveError', callback);
    }
}
