import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./pages/callback/callback').then((m) => m.AuthCallback),
    title: 'Signing in – Notiva',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
    title: 'Login – Notiva',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
    title: 'Create account – Notiva',
  },
];
