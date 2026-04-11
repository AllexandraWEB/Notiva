import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AuthUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuthState();
    }
  }

  private async initAuthState(): Promise<void> {
    const { data } = await this.supabase.getSession();
    if (data.session?.user) {
      this._user.set(this.mapUser(data.session.user));
    }
    this.supabase.onAuthStateChange((_, session) => {
      this._user.set(session?.user ? this.mapUser(session.user) : null);
    });
  }

  private mapUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.['name'],
      avatarUrl: user.user_metadata?.['avatar_url'],
    };
  }

  async signIn(email: string, password: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    const { error } = await this.supabase.signIn(email, password);
    this._loading.set(false);
    if (error) {
      this._error.set(this.mapAuthError(error.message));
    } else {
      await this.router.navigate(['/home']);
    }
  }

  async signUp(email: string, password: string, name: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    const { error } = await this.supabase.signUp(email, password, name);
    this._loading.set(false);
    if (error) {
      this._error.set(this.mapAuthError(error.message));
    } else {
      await this.router.navigate(['/home']);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    const { error } = await this.supabase.signInWithGoogle();
    this._loading.set(false);
    if (error) this._error.set(error.message);
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
    this._user.set(null);
    await this.router.navigate(['/auth/login']);
  }

  clearError(): void {
    this._error.set(null);
  }

  private mapAuthError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('invalid login credentials') || m.includes('invalid email or password'))
      return 'Invalid email or password.';
    if (m.includes('rate limit') || m.includes('email rate limit'))
      return 'Too many requests. Please wait a few minutes and try again.';
    if (m.includes('user already registered'))
      return 'An account with this email already exists.';
    return message;
  }
}
