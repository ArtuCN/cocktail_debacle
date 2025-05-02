import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const fromHome = sessionStorage.getItem("enteredFromHome");
    if (fromHome === "true") {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
