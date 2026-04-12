import { Component, computed, inject } from '@angular/core';
import { PublicNote } from '../../../../core/models/core.models';
import { NoteTemplate } from '../../../../shared/components/note-template/note-template';
import { NotesStore } from '../../../../shared/services/notes-store';

interface NotebookGroup {
  name: string;
  notes: PublicNote[];
}

@Component({
  selector: 'app-notebooks',
  imports: [NoteTemplate],
  templateUrl: './notebooks.html',
  styleUrl: './notebooks.css',
})
export class Notebooks {
  protected readonly notesStore = inject(NotesStore);
  protected readonly groups = computed<NotebookGroup[]>(() => {
    const grouped = new Map<string, PublicNote[]>();

    for (const note of this.notesStore.privateNotes()) {
      const currentGroup = grouped.get(note.notebook) ?? [];
      currentGroup.push(note);
      grouped.set(note.notebook, currentGroup);
    }

    return Array.from(grouped.entries()).map(([name, notes]) => ({
      name,
      notes,
    }));
  });
}
