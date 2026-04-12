import { NoteVisibility } from '../../core/models/core.models';

export interface CreateNotePayload {
  title: string;
  category: string;
  body: string;
  visibility: NoteVisibility;
  bgColor: string;
}