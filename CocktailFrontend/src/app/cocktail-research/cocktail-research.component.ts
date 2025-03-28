import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cocktail-research.component.html',
  styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {

  constructor(private rs: SignalrService) { }
  name: string = '';
  searchCocktail(): void {
    this.rs.searchbyname(this.name);
  }
}
