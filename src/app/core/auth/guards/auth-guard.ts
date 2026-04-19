import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../services/auth-store';

export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authStore.waitForInitialization();

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authStore.waitForInitialization();

  if (!authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};

export const guestMatchGuard: CanMatchFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authStore.waitForInitialization();

  if (!authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
