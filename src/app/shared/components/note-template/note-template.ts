import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PublicNote } from '../../../core/models/core.models';

@Component({
  selector: 'app-note-template',
  imports: [],
  templateUrl: './note-template.html',
  styleUrl: './note-template.css',
})
export class NoteTemplate {
  private readonly router = inject(Router);

  @Input({ required: true }) note!: PublicNote;

  protected openNoteDetails(): void {
    void this.router.navigate(['/note', this.note.id]);
  }
}
