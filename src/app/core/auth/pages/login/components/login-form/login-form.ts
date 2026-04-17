import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthStore } from '../../../../services/auth-store';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  readonly authStore = inject(AuthStore);

  readonly showPassword = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    await this.authStore.signIn(email, password);
  }

  async onGoogleSignIn(): Promise<void> {
    await this.authStore.signInWithGoogle();
  }
}
