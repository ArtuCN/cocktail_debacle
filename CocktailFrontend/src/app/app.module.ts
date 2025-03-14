import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CocktailListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Aggiungi questo modulo
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
