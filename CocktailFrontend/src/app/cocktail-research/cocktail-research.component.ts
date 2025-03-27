import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [],
  templateUrl: './cocktail-research.component.html',
  styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {

  constructor(private rs: SignalrService) { }

  searchCocktail(nome: string): void {
    this.rs.searchbyname(nome);
  }
}
