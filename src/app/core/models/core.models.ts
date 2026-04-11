export type NoteVisibility = 'public' | 'private';

export interface PublicNote {
  id: number;
  notebook: string;
  notebookColor: string;
  bgColor: string;
  tags: string[];
  tagBg: string;
  tagColor: string;
  title: string;
  subtitle?: string;
  body?: string;
  isList?: boolean;
  listItems?: string[];
  visibility: NoteVisibility;
  createdAt: string;
}