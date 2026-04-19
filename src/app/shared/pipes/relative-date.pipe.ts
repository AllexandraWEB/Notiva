import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return 'Unknown date';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date';
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfValueDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const diffInDays = Math.round(
      (startOfToday.getTime() - startOfValueDay.getTime()) / 86_400_000,
    );

    if (diffInDays <= 0) {
      return 'Today';
    }

    if (diffInDays === 1) {
      return 'Yesterday';
    }

    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() === date.getFullYear() ? undefined : 'numeric',
    }).format(date);
  }
}