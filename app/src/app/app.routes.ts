// src/app/routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./views/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./views/home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./views/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
