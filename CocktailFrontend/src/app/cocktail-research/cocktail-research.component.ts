import { Component } from '@angular/core';
import { ResearchService } from '../services/research.service';

@Component({
  selector: 'app-cocktail-research',
  standalone: true,
  imports: [],
  templateUrl: './cocktail-research.component.html',
  styleUrl: './cocktail-research.component.css'
})
export class CocktailResearchComponent {

  constructor(private rs: ResearchService) { }

  searchCocktail(nome: string): void {
    this.rs.searchbyname(nome);
  }
}
