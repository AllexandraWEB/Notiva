import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.css',
})
export class AuthCallback implements OnInit {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  async ngOnInit(): Promise<void> {
    await this.authStore.waitForInitialization();

    if (this.authStore.isAuthenticated()) {
      await this.router.navigate(['/home']);
      return;
    }

    await this.router.navigate(['/auth/login']);
  }
}
