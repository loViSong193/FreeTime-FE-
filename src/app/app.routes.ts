import { Routes } from '@angular/router';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { CarTableComponent } from './car-table/car-table.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: RegisterLoginComponent },
  { path: 'cars', component: CarTableComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
];
