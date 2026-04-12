import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotesStore } from '../../services/notes-store';

@Component({
  selector: 'app-note-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './note-details.html',
  styleUrl: './note-details.css',
})
export class NoteDetails {
  private readonly route = inject(ActivatedRoute);
  protected readonly notesStore = inject(NotesStore);

  protected readonly note = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isNaN(id)) {
      return undefined;
    }

    return this.notesStore.getNoteById(id);
  });
}
