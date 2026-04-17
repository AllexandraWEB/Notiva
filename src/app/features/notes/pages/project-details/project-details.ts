import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth-store';
import { PublicNote } from '../../../../core/models/core.models';
import { NoteTemplate } from '../../../../shared/components/note-template/note-template';
import { NotesStore } from '../../../../shared/services/notes-store';
import { ProjectsStore } from '../../../../shared/services/projects-store';

@Component({
  selector: 'app-project-details',
  imports: [FormsModule, RouterLink, NoteTemplate],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly notesStore = inject(NotesStore);
  protected readonly projectsStore = inject(ProjectsStore);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly projectId = computed(
    () => this.paramMap().get('projectId') ?? '',
  );

  protected readonly project = computed(() =>
    this.projectsStore.getProjectById(this.projectId()),
  );

  protected readonly ownedNotes = computed<PublicNote[]>(() => {
    const currentUserId = this.authStore.user()?.id;

    if (!currentUserId) {
      return [];
    }

    return this.notesStore
      .notes()
      .filter((note) => note.authorId === currentUserId);
  });

  protected readonly folderNotes = computed(() => {
    const currentProject = this.project();

    if (!currentProject) {
      return [];
    }

    return this.projectsStore.getProjectNotes(currentProject, this.ownedNotes());
  });

  protected readonly availableNotes = computed(() => {
    const currentProject = this.project();

    if (!currentProject) {
      return [];
    }

    return this.projectsStore.getAvailableNotesForProject(
      currentProject.id,
      this.ownedNotes(),
    );
  });

  protected selectedNoteId = signal<number | null>(null);
  protected isEditing = signal(false);
  protected editModel = {
    name: '',
    tag: '',
  };

  protected addSelectedNote(): void {
    const currentProject = this.project();
    const noteId = this.selectedNoteId();

    if (!currentProject || !noteId) {
      return;
    }

    const added = this.projectsStore.addNoteToProject(currentProject.id, noteId);

    if (added) {
      this.selectedNoteId.set(null);
    }
  }

  protected removeNote(noteId: number): void {
    const currentProject = this.project();

    if (!currentProject) {
      return;
    }

    this.projectsStore.removeNoteFromProject(currentProject.id, noteId);
  }

  protected startEdit(): void {
    const currentProject = this.project();

    if (!currentProject) {
      return;
    }

    this.editModel = {
      name: currentProject.name,
      tag: currentProject.tag,
    };
    this.isEditing.set(true);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
  }

  protected saveEdit(): void {
    const currentProject = this.project();

    if (!currentProject) {
      return;
    }

    const updated = this.projectsStore.updateProject(currentProject.id, {
      name: this.editModel.name,
      tag: this.editModel.tag,
    });

    if (updated) {
      this.isEditing.set(false);
    }
  }

  protected deleteProject(): void {
    const currentProject = this.project();

    if (!currentProject) {
      return;
    }

    const canDelete =
      typeof window === 'undefined'
        ? true
        : window.confirm('Delete this folder? Notes will stay in your account.');

    if (!canDelete) {
      return;
    }

    const deleted = this.projectsStore.deleteProject(currentProject.id);

    if (deleted) {
      void this.router.navigate(['/projects']);
    }
  }
}
