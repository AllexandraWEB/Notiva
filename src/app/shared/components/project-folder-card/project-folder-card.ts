import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-project-folder-card',
  imports: [],
  templateUrl: './project-folder-card.html',
  styleUrl: './project-folder-card.css',
})
export class ProjectFolderCard {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) fileCount!: number;
  @Output() open = new EventEmitter<void>();

  protected onOpen(): void {
    this.open.emit();
  }
}
