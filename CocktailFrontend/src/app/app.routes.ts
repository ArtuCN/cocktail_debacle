import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { CocktailResearchComponent } from './cocktail-research/cocktail-research.component'; // Aggiungi il componente di ricerca
import { CreateUserComponent } from './create-user/create-user.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ChatComponent } from './chat/chat.component';
import { ADMINPAGEComponent } from './admin-page/admin-page.component';
import { PersonalAreaComponent } from './personal-area/personal-area.component';
import { FullInfoComponent } from './full-info/full-info.component';
import { ChatGuard } from './guards/chat.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: 'home', component: HomeComponent},
    {path: 'personal-area', component: PersonalAreaComponent},
    {path: 'create-user', component: CreateUserComponent},
    {path: 'cocktail-research', component: CocktailResearchComponent},
    {path: 'login', component: LoginComponent},
    {path: 'favorites', component: FavoritesComponent},
    {path: 'chat', component: ChatComponent, canActivate: [ChatGuard]},
    {path: 'error', component: ErrorComponent},
    {path: 'admin', component: ADMINPAGEComponent},
    {path: 'fullinfo', component: FullInfoComponent},
    {path: '**', redirectTo: 'home'},
];

export const appRouter = RouterModule.forRoot(routes);