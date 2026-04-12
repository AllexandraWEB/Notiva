import { NoteVisibility } from "./core.models";

export interface SupabaseNoteInsert {
  title: string;
  category: string;
  body: string;
  visibility: NoteVisibility;
  bg_color: string;
}