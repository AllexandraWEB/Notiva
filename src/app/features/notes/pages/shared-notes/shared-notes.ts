import { Component, inject, signal } from '@angular/core';
import { NoteTemplate } from '../../../../shared/components/note-template/note-template';
import { NoteSearchPipe } from '../../../../shared/pipes/note-search.pipe';
import { NotesStore } from '../../../../shared/services/notes-store';
import { SharedNotesHeader } from './components/shared-notes-header/shared-notes-header';

@Component({
  selector: 'app-shared-notes',
  imports: [SharedNotesHeader, NoteTemplate, NoteSearchPipe],
  templateUrl: './shared-notes.html',
  styleUrl: './shared-notes.css',
})
export class SharedNotes {
  protected readonly notesStore = inject(NotesStore);
  protected readonly searchTerm = signal('');
  protected readonly notes = this.notesStore.publicNotes;

  protected updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }
}
