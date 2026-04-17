import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectFolderCard } from '../../../../shared/components/project-folder-card/project-folder-card';
import { ProjectsStore } from '../../../../shared/services/projects-store';

@Component({
  selector: 'app-projects',
  imports: [FormsModule, ProjectFolderCard],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  private readonly router = inject(Router);
  protected readonly projectsStore = inject(ProjectsStore);

  protected createProject(form: NgForm): void {
    const created = this.projectsStore.createProject({
      name: String(form.value['name'] ?? ''),
      tag: String(form.value['tag'] ?? ''),
    });

    if (created) {
      form.resetForm();
    }
  }

  protected openProject(projectId: string): void {
    void this.router.navigate(['/projects', projectId]);
  }
}
