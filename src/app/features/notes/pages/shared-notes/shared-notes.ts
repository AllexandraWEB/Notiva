import { Component, inject } from '@angular/core';
import { NoteTemplate } from '../../../../shared/components/note-template/note-template';
import { NotesStore } from '../../../../shared/services/notes-store';
import { SharedNotesHeader } from './components/shared-notes-header/shared-notes-header';

@Component({
  selector: 'app-shared-notes',
  imports: [SharedNotesHeader, NoteTemplate],
  templateUrl: './shared-notes.html',
  styleUrl: './shared-notes.css',
})
export class SharedNotes {
  protected readonly notesStore = inject(NotesStore);
  protected readonly notes = this.notesStore.publicNotes;
}
