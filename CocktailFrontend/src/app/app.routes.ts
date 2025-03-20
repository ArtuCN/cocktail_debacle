import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: '**', component: ErrorComponent}
];

export const appRouter = RouterModule.forRoot(routes);