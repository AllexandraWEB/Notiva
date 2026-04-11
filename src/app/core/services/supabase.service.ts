import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NoteVisibility } from '../models/core.models';
import { environment } from '../../../environments/environment';

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

export interface SupabaseNoteInsert {
  title: string;
  category: string;
  body: string;
  visibility: NoteVisibility;
  bg_color: string;
}

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

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }

  getNotes() {
    return this.client
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
  }

  getNoteById(id: number) {
    return this.client.from('notes').select('*').eq('id', id).maybeSingle();
  }

  createNote(payload: SupabaseNoteInsert) {
    return this.client.from('notes').insert(payload).select('*').single();
  }
}
