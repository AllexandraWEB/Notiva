import { Component, Input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/auth/auth-store';
import { PublicNote } from '../../../core/models/core.models';
import { NotesStore } from '../../services/notes-store';

@Component({
  selector: 'app-note-template',
  imports: [],
  templateUrl: './note-template.html',
  styleUrl: './note-template.css',
})
export class NoteTemplate {
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);
  protected readonly notesStore = inject(NotesStore);
  protected readonly isMenuOpen = signal(false);
  protected readonly isDeleteDialogOpen = signal(false);

  @Input({ required: true }) note!: PublicNote;

  protected openNoteDetails(): void {
    void this.router.navigate(['/note', this.note.id]);
  }

  protected canManageNote(): boolean {
    return this.authStore.user()?.id === this.note.authorId;
  }

  protected async toggleFavorite(event: Event): Promise<void> {
    event.stopPropagation();

    if (!this.authStore.isAuthenticated()) {
      void this.router.navigate(['/auth/login']);
      return;
    }

    await this.notesStore.toggleFavorite(this.note);
  }

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected startEdit(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen.set(false);
    this.notesStore.startEditing(this.note);
  }

  protected openDeleteDialog(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen.set(false);
    this.isDeleteDialogOpen.set(true);
  }

  protected closeDeleteDialog(event?: Event): void {
    event?.stopPropagation();
    this.isDeleteDialogOpen.set(false);
  }

  protected async confirmDelete(event: Event): Promise<void> {
    event.stopPropagation();

    const deleted = await this.notesStore.deleteNote(this.note);

    if (deleted) {
      this.isDeleteDialogOpen.set(false);
    }
  }
}
