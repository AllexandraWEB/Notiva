import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthStore } from '../../core/auth/auth-store';
import { NoteVisibility, PublicNote } from '../../core/models/core.models';
import {
  SupabaseNoteInsert,
  SupabaseNoteRow,
  SupabaseService,
} from '../../core/services/supabase.service';

export interface CreateNotePayload {
  title: string;
  category: string;
  body: string;
  visibility: NoteVisibility;
  bgColor: string;
}

interface NoteColorOption {
  name: string;
  value: string;
  accent: string;
  tagBg: string;
  tagColor: string;
}

const DEFAULT_CATEGORIES = [
  'Personal',
  'Work',
  'University',
  'Ideas',
  'Recipes',
  'Diary',
];

const COLOR_OPTIONS: NoteColorOption[] = [
  {
    name: 'Rose',
    value: '#fff0f5',
    accent: '#d63384',
    tagBg: '#fcd7e8',
    tagColor: '#b5245e',
  },
  {
    name: 'Lavender',
    value: '#eef0f8',
    accent: '#5b5ea6',
    tagBg: '#d8dcf2',
    tagColor: '#3c3f7a',
  },
  {
    name: 'Mint',
    value: '#f0fdf4',
    accent: '#2a7a3b',
    tagBg: '#bbedca',
    tagColor: '#1a5c2a',
  },
  {
    name: 'Sand',
    value: '#fff7ed',
    accent: '#c67a2a',
    tagBg: '#fde5c8',
    tagColor: '#9b5b12',
  },
  {
    name: 'Cloud',
    value: '#f8fafc',
    accent: '#475569',
    tagBg: '#e2e8f0',
    tagColor: '#334155',
  },
];

@Injectable({ providedIn: 'root' })
export class NotesStore {
  private readonly authStore = inject(AuthStore);
  private readonly supabase = inject(SupabaseService);

  private readonly _notes = signal<PublicNote[]>([]);
  private readonly _isCreateFormOpen = signal(false);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly notes = this._notes.asReadonly();
  readonly isCreateFormOpen = this._isCreateFormOpen.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  readonly publicNotes = computed(() =>
    this._notes().filter((note) => note.visibility === 'public')
  );
  readonly privateNotes = computed(() =>
    this._notes().filter((note) => note.visibility === 'private')
  );
  readonly categories = computed(() =>
    Array.from(
      new Set([
        ...DEFAULT_CATEGORIES,
        ...this._notes().map((note) => note.notebook),
      ])
    )
  );
  readonly colorOptions = COLOR_OPTIONS;

  constructor() {
    effect(() => {
      this.authStore.user();
      void this.loadNotes();
    });
  }

  openCreateForm(): void {
    this._error.set(null);
    this._isCreateFormOpen.set(true);
  }

  closeCreateForm(): void {
    this._error.set(null);
    this._isCreateFormOpen.set(false);
  }

  clearError(): void {
    this._error.set(null);
  }

  async loadNotes(): Promise<void> {
    this._loading.set(true);

    const { data, error } = await this.supabase.getNotes();

    this._loading.set(false);

    if (error) {
      this._notes.set([]);
      this._error.set(this.mapError(error.code, error.message));
      return;
    }

    this._error.set(null);
    this._notes.set((data ?? []).map((note) => this.mapRowToNote(note)));
  }

  async addNote(payload: CreateNotePayload): Promise<PublicNote | null> {
    if (!this.authStore.isAuthenticated()) {
      this._error.set('Please sign in first so the note can be saved to Supabase.');
      return null;
    }

    this._saving.set(true);
    this._error.set(null);

    const insertPayload: SupabaseNoteInsert = {
      title: payload.title.trim(),
      category: payload.category.trim(),
      body: payload.body.trim(),
      visibility: payload.visibility,
      bg_color: payload.bgColor,
    };

    const { data, error } = await this.supabase.createNote(insertPayload);

    this._saving.set(false);

    if (error) {
      this._error.set(this.mapError(error.code, error.message));
      return null;
    }

    const createdNote = this.mapRowToNote(data as SupabaseNoteRow);
    this._notes.update((notes) => [createdNote, ...notes]);
    this.closeCreateForm();

    return createdNote;
  }

  getNoteById(id: number): PublicNote | undefined {
    return this._notes().find((note) => note.id === id);
  }

  private mapRowToNote(note: SupabaseNoteRow): PublicNote {
    const palette =
      COLOR_OPTIONS.find((option) => option.value === note.bg_color) ??
      COLOR_OPTIONS[0];

    return {
      id: note.id,
      notebook: note.category,
      notebookColor: palette.accent,
      bgColor: note.bg_color,
      tags: [note.visibility === 'public' ? 'Public 🌍' : 'Private 🔒'],
      tagBg: palette.tagBg,
      tagColor: palette.tagColor,
      title: note.title,
      subtitle:
        note.visibility === 'public'
          ? 'Visible in All notes'
          : 'Visible only in Notebooks',
      body: note.body,
      visibility: note.visibility,
      createdAt: note.created_at,
    };
  }

  private mapError(code: string | null | undefined, message: string): string {
    if (code === 'PGRST205') {
      return 'Supabase notes table is not set up yet. Run the SQL in `supabase/notes_schema.sql` once in the Supabase SQL Editor.';
    }

    if (message.toLowerCase().includes('row-level security')) {
      return 'You need to be signed in to save or view private notes.';
    }

    return message;
  }
}
