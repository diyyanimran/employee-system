import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService  {

  constructor() { }

  private hubConnection!: signalR.HubConnection;

  startConnection(userId: number): void
  {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7128/chathub')
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().then(() => 
    {
      this.hubConnection.invoke('Register', userId);
    }).catch(err => console.error("SignalR connection error"));
  }

  onReceiveMessage(callback: (senderId: number, message: string) => void)
  {
    this.hubConnection.on("receiveMessage", callback);
  }
}
