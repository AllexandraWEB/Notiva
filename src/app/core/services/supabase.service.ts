import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  Session,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SupabaseNoteInsert } from '../models/supabase-note-insert.model';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabasePublishableKey
  );

  signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string, name: string) {
    return this.client.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
  }

  signInWithGoogle() {
    return this.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  signOut() {
    return this.client.auth.signOut();
  }

  getSession() {
    return this.client.auth.getSession();
  }

  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  getNotes() {
    return this.client
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
  }

  getFavoriteNoteIds() {
    return this.client.from('note_favorites').select('note_id, user_id, created_at');
  }

  getNoteById(id: number) {
    return this.client.from('notes').select('*').eq('id', id).maybeSingle();
  }

  createNote(payload: SupabaseNoteInsert) {
    return this.client.from('notes').insert(payload).select('*').single();
  }

  updateNote(id: number, payload: SupabaseNoteInsert) {
    return this.client
      .from('notes')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();
  }

  deleteNote(id: number) {
    return this.client.from('notes').delete().eq('id', id);
  }

  addFavorite(noteId: number) {
    return this.client
      .from('note_favorites')
      .upsert({ note_id: noteId }, { onConflict: 'note_id,user_id' })
      .select('note_id')
      .single();
  }

  removeFavorite(noteId: number) {
    return this.client.from('note_favorites').delete().eq('note_id', noteId);
  }
}
