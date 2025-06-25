import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { DbConnectionGuard } from './guards/db-connection.guard';

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
        canActivate: [DbConnectionGuard],
        loadComponent: () =>
          import('./views/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'ai',
        loadComponent: () =>
          import('./views/ai/ai.component').then((m) => m.AiComponent),
      },
      {
        path: 'settings',
        canActivate: [DbConnectionGuard],
        loadComponent: () =>
          import('./views/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },
  {
    path: 'init-connection',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./views/init-connection/init-connection.component').then(
        (m) => m.InitConnectionComponent
      ),
  },

  { path: '**', redirectTo: 'auth' },
];
