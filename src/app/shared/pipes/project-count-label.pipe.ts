import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectCountLabel',
})
export class ProjectCountLabelPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    const count = Number(value ?? 0);

    if (!Number.isFinite(count) || count <= 0) {
      return 'No notes yet';
    }

    if (count === 1) {
      return '1 note';
    }

    return `${count} notes`;
  }
}