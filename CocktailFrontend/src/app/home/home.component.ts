import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchQuery: string = '';
  cocktail: any;

  constructor(private http: HttpClient) {}

  searchCocktail() {
    if (this.searchQuery.length > 2) {
      this.http.get(`http://localhost:5001/api/cocktails/${this.searchQuery}`)
        .subscribe(data => this.cocktail = data);
    }
  }
}
