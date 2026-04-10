import { Component } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { radixMagnifyingGlass } from "@ng-icons/radix-icons";
import {
  lucideFilter,
  lucideLayoutGrid,
  lucideList,
  lucideChevronLeft,
} from "@ng-icons/lucide";

@Component({
  selector: "app-shared-notes-header",
  imports: [NgIcon],
  templateUrl: "./shared-notes-header.html",
  styleUrl: "./shared-notes-header.css",
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
