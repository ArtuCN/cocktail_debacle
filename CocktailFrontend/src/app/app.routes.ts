import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { TestService } from './services/services.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'services', component: TestService},
    {path: '**', redirectTo: '/error'}
];

export const appRouter = RouterModule.forRoot(routes);