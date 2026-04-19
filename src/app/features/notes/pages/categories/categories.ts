import { Component, computed, inject, signal } from '@angular/core';
import { CategorySearchPipe } from '../../../../shared/pipes/category-search.pipe';
import { NoteTemplate } from '../../../../shared/components/note-template/note-template';
import { NotesStore } from '../../../../shared/services/notes-store';

@Component({
  selector: 'app-categories',
  imports: [NoteTemplate, CategorySearchPipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  protected readonly notesStore = inject(NotesStore);
  protected readonly categorySearchTerm = signal('');
  protected readonly categories = computed(() => this.notesStore.categories());

  protected readonly filteredNotes = computed(() => {
    const searchTerm = this.categorySearchTerm().trim().toLowerCase();

    if (!searchTerm) {
      return this.notesStore.notes();
    }

    return this.notesStore
      .notes()
      .filter((note) => note.notebook.toLowerCase().includes(searchTerm));
  });

  protected updateSearchTerm(value: string): void {
    this.categorySearchTerm.set(value);
  }
}
