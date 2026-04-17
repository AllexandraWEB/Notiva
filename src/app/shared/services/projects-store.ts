import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AuthStore } from '../../core/auth/auth-store';
import { PublicNote } from '../../core/models/core.models';
import {
  CreateProjectPayload,
  ProjectFolder,
} from '../models/project-folder.model';

const PROJECT_FOLDER_COLOR = '#6b7280';

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly authStore = inject(AuthStore);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _projects = signal<ProjectFolder[]>([]);
  private readonly _projectNoteMap = signal<Record<string, number[]>>({});
  private readonly _expandedProjectId = signal<string | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly projectNoteMap = this._projectNoteMap.asReadonly();
  readonly expandedProjectId = this._expandedProjectId.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasProjects = computed(() => this._projects().length > 0);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    effect(
      () => {
        const userId = this.authStore.user()?.id;

        if (!userId) {
          this._projects.set([]);
          this._projectNoteMap.set({});
          this._expandedProjectId.set(null);
          this._error.set(null);
          return;
        }

        this._projects.set(this.readProjectsFromStorage(userId));
        this._projectNoteMap.set(this.readProjectNoteMapFromStorage(userId));
        this._expandedProjectId.set(null);
        this._error.set(null);
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const userId = this.authStore.user()?.id;

      if (!userId) {
        return;
      }

      this.persistProjects(userId, this._projects());
      this.persistProjectNoteMap(userId, this._projectNoteMap());
    });
  }

  createProject(payload: CreateProjectPayload): ProjectFolder | null {
    if (!this.authStore.isAuthenticated()) {
      this._error.set('Please sign in first to create projects.');
      return null;
    }

    const name = payload.name.trim();
    const tag = payload.tag.trim();

    if (!name) {
      this._error.set('Project name is required.');
      return null;
    }

    if (
      this._projects().some(
        (project) => project.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      this._error.set('A project with this name already exists.');
      return null;
    }

    const project: ProjectFolder = {
      id: this.makeProjectId(),
      name,
      color: PROJECT_FOLDER_COLOR,
      tag,
      createdAt: new Date().toISOString(),
    };

    this._projects.update((projects) => [project, ...projects]);
    this._projectNoteMap.update((current) => ({
      ...current,
      [project.id]: [],
    }));
    this._expandedProjectId.set(project.id);
    this._error.set(null);

    return project;
  }

  updateProject(projectId: string, payload: CreateProjectPayload): boolean {
    const name = payload.name.trim();

    if (!name) {
      this._error.set('Project name is required.');
      return false;
    }

    const alreadyExists = this._projects().some(
      (project) =>
        project.id !== projectId &&
        project.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      this._error.set('A project with this name already exists.');
      return false;
    }

    let updated = false;

    this._projects.update((projects) =>
      projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        updated = true;

        return {
          ...project,
          name,
          color: PROJECT_FOLDER_COLOR,
          tag: payload.tag.trim(),
        };
      }),
    );

    if (!updated) {
      this._error.set('Project not found.');
      return false;
    }

    this._error.set(null);
    return true;
  }

  deleteProject(projectId: string): boolean {
    const exists = this._projects().some((project) => project.id === projectId);

    if (!exists) {
      this._error.set('Project not found.');
      return false;
    }

    this._projects.update((projects) =>
      projects.filter((project) => project.id !== projectId),
    );

    this._projectNoteMap.update((map) => {
      const next = { ...map };
      delete next[projectId];
      return next;
    });

    if (this._expandedProjectId() === projectId) {
      this._expandedProjectId.set(null);
    }

    this._error.set(null);
    return true;
  }

  getProjectById(projectId: string): ProjectFolder | undefined {
    return this._projects().find((project) => project.id === projectId);
  }

  toggleProject(projectId: string): void {
    this._expandedProjectId.update((current) =>
      current === projectId ? null : projectId,
    );
  }

  getProjectNotes(project: ProjectFolder, notes: PublicNote[]): PublicNote[] {
    const noteIds = this._projectNoteMap()[project.id] ?? [];
    const notesById = new Map(notes.map((note) => [note.id, note]));

    return noteIds
      .map((noteId) => notesById.get(noteId))
      .filter((note): note is PublicNote => note !== undefined);
  }

  addNoteToProject(projectId: string, noteId: number): boolean {
    const hasProject = this._projects().some((project) => project.id === projectId);

    if (!hasProject) {
      this._error.set('Project not found.');
      return false;
    }

    const noteIds = this._projectNoteMap()[projectId] ?? [];

    if (noteIds.includes(noteId)) {
      this._error.set('This note is already in the project.');
      return false;
    }

    this._projectNoteMap.update((current) => ({
      ...current,
      [projectId]: [...noteIds, noteId],
    }));
    this._error.set(null);
    return true;
  }

  removeNoteFromProject(projectId: string, noteId: number): void {
    const noteIds = this._projectNoteMap()[projectId] ?? [];

    this._projectNoteMap.update((current) => ({
      ...current,
      [projectId]: noteIds.filter((id) => id !== noteId),
    }));
    this._error.set(null);
  }

  getAvailableNotesForProject(
    projectId: string,
    notes: PublicNote[],
  ): PublicNote[] {
    const assignedIds = new Set(this._projectNoteMap()[projectId] ?? []);
    return notes.filter((note) => !assignedIds.has(note.id));
  }

  private storageKey(userId: string): string {
    return `notiva.projects.${userId}`;
  }

  private readProjectsFromStorage(userId: string): ProjectFolder[] {
    const saved = localStorage.getItem(this.storageKey(userId));

    if (!saved) {
      return [];
    }

    try {
      const parsed = JSON.parse(saved) as ProjectFolder[];

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(
          (project) =>
            typeof project.id === 'string' &&
            typeof project.name === 'string' &&
            typeof project.tag === 'string' &&
            typeof project.createdAt === 'string',
        )
        .map((project) => ({
          ...project,
          color: PROJECT_FOLDER_COLOR,
        }));
    } catch {
      return [];
    }
  }

  private projectNotesStorageKey(userId: string): string {
    return `notiva.project-notes.${userId}`;
  }

  private readProjectNoteMapFromStorage(userId: string): Record<string, number[]> {
    const saved = localStorage.getItem(this.projectNotesStorageKey(userId));

    if (!saved) {
      return {};
    }

    try {
      const parsed = JSON.parse(saved) as Record<string, unknown>;

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {};
      }

      return Object.entries(parsed).reduce<Record<string, number[]>>(
        (map, [projectId, value]) => {
          if (!Array.isArray(value)) {
            return map;
          }

          map[projectId] = value
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id));

          return map;
        },
        {},
      );
    } catch {
      return {};
    }
  }

  private persistProjects(userId: string, projects: ProjectFolder[]): void {
    localStorage.setItem(this.storageKey(userId), JSON.stringify(projects));
  }

  private persistProjectNoteMap(
    userId: string,
    projectNoteMap: Record<string, number[]>,
  ): void {
    localStorage.setItem(
      this.projectNotesStorageKey(userId),
      JSON.stringify(projectNoteMap),
    );
  }

  private makeProjectId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
  }
}
