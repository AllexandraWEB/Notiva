import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categorySearch',
})
export class CategorySearchPipe implements PipeTransform {
  transform(categories: readonly string[] | null | undefined, searchTerm: string | null | undefined): string[] {
    if (!categories?.length) {
      return [];
    }

    const normalizedSearchTerm = (searchTerm ?? '').trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return [...categories];
    }

    return categories.filter((category) =>
      category.toLowerCase().includes(normalizedSearchTerm),
    );
  }
}