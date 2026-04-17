import { Component, computed, inject, signal } from "@angular/core";
import { NoteTemplate } from "../../../../shared/components/note-template/note-template";
import { NotesStore } from "../../../../shared/services/notes-store";

@Component({
  selector: "app-categories",
  imports: [NoteTemplate],
  templateUrl: "./categories.html",
  styleUrl: "./categories.css",
})
export class Categories {
  protected readonly notesStore = inject(NotesStore);
  protected readonly categories = ["Work", "University", "Ideas", "Recipes"];
  protected readonly selectedCategory = signal("Work");

  protected readonly filteredNotes = computed(() =>
    this.notesStore
      .notes()
      .filter((note) => note.notebook === this.selectedCategory()),
  );

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
