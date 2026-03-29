import { Component, Input } from "@angular/core";
import { PublicNote } from "../../../core/models/core.models";

@Component({
  selector: "app-note-template",
  imports: [],
  templateUrl: "./note-template.html",
  styleUrl: "./note-template.css",
})
export class NoteTemplate {
  @Input({ required: true }) note!: PublicNote;
}
