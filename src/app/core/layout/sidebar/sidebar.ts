import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { NotesStore } from '../../../shared/services/notes-store';
import { AuthStore } from '../../auth/services/auth-store';

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
  protected readonly isMobileOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(() => this.isMobileOpen.set(false));
  }

  protected toggleMobile(): void {
    this.isMobileOpen.update(v => !v);
  }

  protected closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  protected openCreateForm(): void {
    if (!this.authStore.isAuthenticated()) {
      void this.router.navigate(['/auth/login']);
      return;
    }

    this.notesStore.openCreateForm();
    this.closeMobile();
  }

  protected signOut(): void {
    this.authStore.signOut();
  }
}
