import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../auth/auth-store';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-notes-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './notes-layout.html',
  styleUrl: './notes-layout.css',
})
export class NotesLayout {
  protected readonly authStore = inject(AuthStore);
}
