import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { radixMagnifyingGlass } from '@ng-icons/radix-icons';
import {
  lucideChevronLeft,
  lucideFilter,
  lucideLayoutGrid,
  lucideList,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-shared-notes-header',
  imports: [NgIcon, RouterLink],
  templateUrl: './shared-notes-header.html',
  styleUrl: './shared-notes-header.css',
  viewProviders: [
    provideIcons({
      radixMagnifyingGlass,
      lucideFilter,
      lucideLayoutGrid,
      lucideList,
      lucideChevronLeft,
    }),
  ],
})
export class SharedNotesHeader {}
