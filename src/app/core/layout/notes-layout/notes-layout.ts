import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoteCreationForm } from '../../../shared/components/note-creation-form/note-creation-form';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-notes-layout',
  imports: [RouterOutlet, Sidebar, NoteCreationForm],
  templateUrl: './notes-layout.html',
  styleUrl: './notes-layout.css',
})
export class NotesLayout {}
