import { NoteVisibility } from "./core.models";

export interface SupabaseNoteRow {
  id: number;
  user_id: string;
  title: string;
  category: string;
  body: string;
  visibility: NoteVisibility;
  bg_color: string;
  created_at: string;
}