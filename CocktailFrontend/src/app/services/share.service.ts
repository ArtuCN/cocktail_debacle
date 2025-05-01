import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';


@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(srs: SignalrService) {
    
   }
}
