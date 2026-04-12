import { Component, inject } from '@angular/core';
import { NoteTemplate } from '../../../../shared/components/note-template/note-template';
import { NotesStore } from '../../../../shared/services/notes-store';

@Component({
  selector: 'app-favorites',
  imports: [NoteTemplate],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  protected readonly notesStore = inject(NotesStore);
  protected readonly notes = this.notesStore.favoriteNotes;
}
