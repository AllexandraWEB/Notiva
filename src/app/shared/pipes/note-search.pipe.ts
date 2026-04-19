import { Pipe, PipeTransform } from '@angular/core';
import { PublicNote } from '../../core/models/core.models';

@Pipe({
  name: 'noteSearch',
})
export class NoteSearchPipe implements PipeTransform {
  transform(notes: readonly PublicNote[] | null | undefined, searchTerm: string | null | undefined): PublicNote[] {
    if (!notes?.length) {
      return [];
    }

    const normalizedSearchTerm = (searchTerm ?? '').trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return [...notes];
    }

    return notes.filter((note) => {
      const haystack = [
        note.title,
        note.subtitle ?? '',
        note.body ?? '',
        note.notebook,
        note.tags.join(' '),
        (note.listItems ?? []).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearchTerm);
    });
  }
}