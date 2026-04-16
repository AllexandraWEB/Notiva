import { NoteColorOption } from "../models/note-color.model";

export const COLOR_OPTIONS: NoteColorOption[] = [
  {
    name: 'Rose',
    value: '#fff0f5',
    accent: '#d63384',
    tagBg: '#fcd7e8',
    tagColor: '#b5245e',
  },
  {
    name: 'Lavender',
    value: '#eef0f8',
    accent: '#5b5ea6',
    tagBg: '#d8dcf2',
    tagColor: '#3c3f7a',
  },
  {
    name: 'Mint',
    value: '#f0fdf4',
    accent: '#2a7a3b',
    tagBg: '#bbedca',
    tagColor: '#1a5c2a',
  },
  {
    name: 'Sand',
    value: '#fff7ed',
    accent: '#c67a2a',
    tagBg: '#fde5c8',
    tagColor: '#9b5b12',
  },
  {
    name: 'Cloud',
    value: '#f8fafc',
    accent: '#475569',
    tagBg: '#e2e8f0',
    tagColor: '#334155',
  },
];

export const PROJECT_COLOR_OPTIONS: NoteColorOption[] = COLOR_OPTIONS.slice(0, 4);

export const DEFAULT_CATEGORIES = [
  'Personal',
  'Work',
  'University',
  'Ideas',
  'Recipes',
  'Diary',
];