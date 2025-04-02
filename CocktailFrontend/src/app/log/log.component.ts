import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from '../services/signalr.service';


@Component({
  selector: 'app-log',
  standalone: true,
  imports: [],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent {

  constructor(private rs: SignalrService){}

}
