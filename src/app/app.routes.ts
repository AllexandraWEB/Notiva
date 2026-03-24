import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Notiva – Shared Notes',
    loadComponent: () =>
      import('./features/notes/pages/shared-notes/shared-notes').then(
        (m) => m.SharedNotes
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'notes',
    canActivate: [authGuard],
    title: 'My Notes – Notiva',
    loadComponent: () =>
      import('./features/notes/pages/my-notes/my-notes').then((m) => m.MyNotes),
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    title: 'Favorites – Notiva',
    loadComponent: () =>
      import('./features/notes/pages/favorites/favorites').then(
        (m) => m.Favorites
      ),
  },
  {
    path: 'recent',
    canActivate: [authGuard],
    title: 'Recent Notes – Notiva',
    loadComponent: () =>
      import('./features/notes/pages/recent/recent').then((m) => m.Recent),
  },
  {
    path: 'notebooks',
    canActivate: [authGuard],
    title: 'Notebooks – Notiva',
    loadComponent: () =>
      import('./features/notes/pages/notebooks/notebooks').then(
        (m) => m.Notebooks
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

