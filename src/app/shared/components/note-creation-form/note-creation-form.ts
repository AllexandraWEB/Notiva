import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotesStore } from '../../services/notes-store';

@Component({
  selector: 'app-note-creation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './note-creation-form.html',
  styleUrl: './note-creation-form.css',
})
export class NoteCreationForm {
  protected readonly notesStore = inject(NotesStore);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isEditing = computed(() => this.notesStore.editingNote() !== null);

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    category: [this.notesStore.categories()[0] ?? 'Personal', Validators.required],
    body: ['', [Validators.required, Validators.maxLength(4000)]],
    visibility: this.formBuilder.nonNullable.control<'public' | 'private'>(
      'public',
      Validators.required
    ),
    bgColor: [this.notesStore.colorOptions[0].value, Validators.required],
  });

  constructor() {
    effect(() => {
      const note = this.notesStore.editingNote();

      if (note) {
        this.form.reset({
          title: note.title,
          category: note.notebook,
          body: note.body ?? '',
          visibility: note.visibility,
          bgColor: note.bgColor,
        });
      }
    });
  }

  protected selectColor(color: string): void {
    this.notesStore.clearError();
    this.form.controls.bgColor.setValue(color);
  }

  protected close(): void {
    this.notesStore.closeCreateForm();
    this.resetForm();
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentEditingNote = this.notesStore.editingNote();
    const saved = currentEditingNote
      ? await this.notesStore.updateNote(currentEditingNote.id, this.form.getRawValue())
      : await this.notesStore.addNote(this.form.getRawValue());

    if (saved) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      category: this.notesStore.categories()[0] ?? 'Personal',
      body: '',
      visibility: 'public',
      bgColor: this.notesStore.colorOptions[0].value,
    });
  }
}
