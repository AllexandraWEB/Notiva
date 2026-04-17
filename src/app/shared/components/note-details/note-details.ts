import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RelativeDatePipe } from '../../pipes/relative-date.pipe';
import { NotesStore } from '../../services/notes-store';

@Component({
  selector: 'app-note-details',
  imports: [RouterLink, DatePipe, RelativeDatePipe],
  templateUrl: './note-details.html',
  styleUrl: './note-details.css',
})
export class NoteDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  protected readonly notesStore = inject(NotesStore);
  private routeParamSubscription?: Subscription;
  private readonly noteId = signal<number | null>(null);

  protected readonly note = computed(() => {
    const id = this.noteId();

    if (id === null) {
      return undefined;
    }

    return this.notesStore.getNoteById(id);
  });

  ngOnInit(): void {
    this.routeParamSubscription = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.noteId.set(this.parseNoteId(paramMap));

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeParamSubscription?.unsubscribe();
  }

  private parseNoteId(paramMap: ParamMap): number | null {
    const id = Number(paramMap.get('id'));

    return Number.isNaN(id) ? null : id;
  }
}
