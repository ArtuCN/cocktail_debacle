import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { first } from "rxjs";
import { User } from "../models/models";
import { Cocktail } from "../models/models";

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

    onReceiveCocktails(callback: (cocktails: any[]) => void): void {
        this.hubConnection.on('ReceiveCocktails', callback);
    }

    // Metodo per ascoltare errori
    onReceiveError(callback: (error: string) => void): void {
        this.hubConnection.on('ReceiveError', callback);
    }



    createUser(firstname:string ,lastname:string ,mail: string, birthdate:Date, psw: string): void{
        if (1 == 1) {
            firstname = 'franco';
            lastname = 'rossi';
            mail = 'cane@email.com';
            birthdate = new Date('2000-01-01');
            psw = 'password';
        }
        /*
        const user = {
            firstname: firstname,
            lastname: lastname,
            mail: mail,
            birthdate: birthdate,
            psw: psw
        };*/
        const user = new User(firstname, lastname, mail, birthdate, psw);

        console.log(`🔍 service CREATE request for: ${firstname} ${lastname} ${mail} ${birthdate} ${psw}`);
        this.hubConnection
          .invoke('CreateUser', user)
          .catch((err) => console.error('error while sending new log', err));
    }
}
