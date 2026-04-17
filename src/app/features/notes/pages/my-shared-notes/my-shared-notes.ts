import { Component, computed, inject } from "@angular/core";
import { AuthStore } from "../../../../core/auth/auth-store";
import { NoteTemplate } from "../../../../shared/components/note-template/note-template";
import { NotesStore } from "../../../../shared/services/notes-store";

@Component({
  selector: "app-my-shared-notes",
  imports: [NoteTemplate],
  templateUrl: "./my-shared-notes.html",
  styleUrl: "./my-shared-notes.css",
})
export class MySharedNotes {
  protected readonly authStore = inject(AuthStore);
  protected readonly notesStore = inject(NotesStore);

  protected readonly notes = computed(() => {
    const currentUserId = this.authStore.user()?.id;

    if (!currentUserId) {
      return [];
    }

    return this.notesStore
      .publicNotes()
      .filter((note) => note.authorId === currentUserId);
  });
}
