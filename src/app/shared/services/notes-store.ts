import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { AuthStore } from "../../core/auth/auth-store";
import { PublicNote } from "../../core/models/core.models";
import { SupabaseService } from "../../core/services/supabase.service";
import { CreateNotePayload } from "../models/note-payload.model";
import { COLOR_OPTIONS, DEFAULT_CATEGORIES } from "../consts/consts";
import { SupabaseFavoriteRow } from "../../core/models/supabase-favorite.model";
import { SupabaseNoteInsert } from "../../core/models/supabase-note-insert.model";
import { SupabaseNoteRow } from "../../core/models/supabase-note-row.model";

@Injectable({ providedIn: "root" })
export class NotesStore {
  private readonly authStore = inject(AuthStore);
  private readonly supabase = inject(SupabaseService);

  private readonly _notes = signal<PublicNote[]>([]);
  private readonly _isCreateFormOpen = signal(false);
  private readonly _editingNote = signal<PublicNote | null>(null);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly notes = this._notes.asReadonly();
  readonly isCreateFormOpen = this._isCreateFormOpen.asReadonly();
  readonly editingNote = this._editingNote.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  readonly publicNotes = computed(() =>
    this._notes().filter((note) => note.visibility === "public"),
  );
  readonly privateNotes = computed(() =>
    this._notes().filter(
      (note) => note.visibility === "private" && this.isOwner(note),
    ),
  );
  readonly favoriteNotes = computed(() =>
    this._notes().filter((note) => note.isFavorite),
  );
  readonly categories = computed(() =>
    Array.from(
      new Set([
        ...DEFAULT_CATEGORIES,
        ...this._notes().map((note) => note.notebook),
      ]),
    ),
  );
  readonly colorOptions = COLOR_OPTIONS;

  constructor() {
    effect(() => {
      this.authStore.user();
      void this.loadNotes();
    });
  }

  openCreateForm(): void {
    this._editingNote.set(null);
    this._error.set(null);
    this._isCreateFormOpen.set(true);
  }

  startEditing(note: PublicNote): void {
    if (!this.isOwner(note)) {
      this._error.set("Only the author of this note can edit it.");
      return;
    }

    this._editingNote.set(note);
    this._error.set(null);
    this._isCreateFormOpen.set(true);
  }

  closeCreateForm(): void {
    this._editingNote.set(null);
    this._error.set(null);
    this._isCreateFormOpen.set(false);
  }

  clearError(): void {
    this._error.set(null);
  }

  async loadNotes(): Promise<void> {
    this._loading.set(true);

    const notesResult = await this.supabase.getNotes();
    const user = this.authStore.user();

    let favoriteIds = new Set<number>();

    if (user) {
      const { data: favoriteData, error: favoriteError } =
        await this.supabase.getFavoriteNoteIds();

      if (favoriteError) {
        this._error.set(
          this.mapError(favoriteError.code, favoriteError.message),
        );
      } else {
        favoriteIds = new Set(
          ((favoriteData ?? []) as SupabaseFavoriteRow[]).map((row) =>
            Number(row.note_id),
          ),
        );
      }
    }

    this._loading.set(false);

    if (notesResult.error) {
      this._notes.set([]);
      this._error.set(
        this.mapError(notesResult.error.code, notesResult.error.message),
      );
      return;
    }

    if (!this._error()) {
      this._error.set(null);
    }

    this._notes.set(
      (notesResult.data ?? []).map((note) =>
        this.mapRowToNote(note, favoriteIds),
      ),
    );
  }

  async addNote(payload: CreateNotePayload): Promise<PublicNote | null> {
    if (!this.authStore.isAuthenticated()) {
      this._error.set(
        "Please sign in first so the note can be saved to Supabase.",
      );
      return null;
    }

    this._saving.set(true);
    this._error.set(null);

    const insertPayload: SupabaseNoteInsert = this.mapPayloadToInsert(payload);
    const { data, error } = await this.supabase.createNote(insertPayload);

    this._saving.set(false);

    if (error) {
      this._error.set(this.mapError(error.code, error.message));
      return null;
    }

    const createdNote = this.mapRowToNote(data as SupabaseNoteRow, new Set());
    this._notes.update((notes) => [createdNote, ...notes]);
    this.closeCreateForm();

    return createdNote;
  }

  async updateNote(
    noteId: number,
    payload: CreateNotePayload,
  ): Promise<PublicNote | null> {
    const existingNote = this.getNoteById(noteId);

    if (!existingNote || !this.isOwner(existingNote)) {
      this._error.set("Only the author of this note can edit it.");
      return null;
    }

    this._saving.set(true);
    this._error.set(null);

    const { data, error } = await this.supabase.updateNote(
      noteId,
      this.mapPayloadToInsert(payload),
    );

    this._saving.set(false);

    if (error) {
      this._error.set(this.mapError(error.code, error.message));
      return null;
    }

    const updatedNote = this.mapRowToNote(
      data as SupabaseNoteRow,
      existingNote.isFavorite ? new Set([noteId]) : new Set(),
    );

    this._notes.update((notes) =>
      notes.map((note) => (note.id === noteId ? updatedNote : note)),
    );
    this.closeCreateForm();

    return updatedNote;
  }

  async deleteNote(note: PublicNote): Promise<boolean> {
    if (!this.isOwner(note)) {
      this._error.set("Only the author of this note can delete it.");
      return false;
    }

    const { error } = await this.supabase.deleteNote(note.id);

    if (error) {
      this._error.set(this.mapError(error.code, error.message));
      return false;
    }

    this._notes.update((notes) =>
      notes.filter((existing) => existing.id !== note.id),
    );
    return true;
  }

  async toggleFavorite(note: PublicNote): Promise<boolean> {
    if (!this.authStore.isAuthenticated()) {
      this._error.set("Please sign in to save notes to favorites.");
      return false;
    }

    this._error.set(null);

    const result = note.isFavorite
      ? await this.supabase.removeFavorite(note.id)
      : await this.supabase.addFavorite(note.id);

    if (result.error) {
      this._error.set(this.mapError(result.error.code, result.error.message));
      return false;
    }

    this._notes.update((notes) =>
      notes.map((existing) =>
        existing.id === note.id
          ? { ...existing, isFavorite: !existing.isFavorite }
          : existing,
      ),
    );

    return true;
  }

  getNoteById(id: number): PublicNote | undefined {
    return this._notes().find((note) => note.id === id);
  }

  private mapPayloadToInsert(payload: CreateNotePayload): SupabaseNoteInsert {
    return {
      title: payload.title.trim(),
      category: payload.category.trim(),
      body: payload.body.trim(),
      visibility: payload.visibility,
      bg_color: payload.bgColor,
    };
  }

  private mapRowToNote(
    note: SupabaseNoteRow,
    favoriteIds: Set<number> = new Set(),
  ): PublicNote {
    const palette =
      COLOR_OPTIONS.find((option) => option.value === note.bg_color) ??
      COLOR_OPTIONS[0];

    return {
      id: note.id,
      notebook: note.category,
      notebookColor: palette.accent,
      bgColor: note.bg_color,
      tags: [note.visibility === "public" ? "Public" : "Private"],
      tagBg: palette.tagBg,
      tagColor: palette.tagColor,
      title: note.title,
      body: note.body,
      visibility: note.visibility,
      createdAt: note.created_at,
      authorId: note.user_id,
      isFavorite: favoriteIds.has(Number(note.id)),
    };
  }

  private isOwner(note: PublicNote): boolean {
    return this.authStore.user()?.id === note.authorId;
  }

  private mapError(code: string | null | undefined, message: string): string {
    if (code === "PGRST205") {
      return "Supabase notes or favorites tables are not set up yet. Run the SQL in `supabase/notes_schema.sql` once in the Supabase SQL Editor.";
    }

    if (message.toLowerCase().includes("row-level security")) {
      return "You can only edit or delete your own notes, and favorites require a signed-in account.";
    }

    return message;
  }
}
