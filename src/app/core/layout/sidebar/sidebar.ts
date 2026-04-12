import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotesStore } from '../../../shared/services/notes-store';
import { AuthStore } from '../../auth/auth-store';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);
  protected readonly notesStore = inject(NotesStore);

  protected openCreateForm(): void {
    if (!this.authStore.isAuthenticated()) {
      void this.router.navigate(['/auth/login']);
      return;
    }

    this.notesStore.openCreateForm();
  }

  protected signOut(): void {
    this.authStore.signOut();
  }
}
