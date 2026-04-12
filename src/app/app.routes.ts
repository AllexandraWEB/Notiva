import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/notes-layout/notes-layout').then(
        (m) => m.NotesLayout
      ),
    children: [
      {
        path: '',
        title: 'Notiva – Public Notes',
        loadComponent: () =>
          import('./features/notes/pages/shared-notes/shared-notes').then(
            (m) => m.SharedNotes
          ),
      },
      {
        path: 'home',
        title: 'Home – Notiva',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'note/:id',
        title: 'Note Details – Notiva',
        loadComponent: () =>
          import('./shared/components/note-details/note-details').then(
            (m) => m.NoteDetails
          ),
      },
      {
        path: 'notes',
        canActivate: [authGuard],
        title: 'My Notes – Notiva',
        loadComponent: () =>
          import('./features/notes/pages/my-notes/my-notes').then(
            (m) => m.MyNotes
          ),
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
        path: 'categories',
        canActivate: [authGuard],
        title: 'Categories – Notiva',
        loadComponent: () =>
          import('./features/notes/pages/categories/categories').then(
            (m) => m.Categories
          ),
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
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

