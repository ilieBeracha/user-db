// src/app/auth-guard.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../core/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  if (auth.isAuthenticated()) {
    if (state.url.includes('/auth')) {
      router.navigate(['/query-builder']);
      return false;
    }
    return true;
  } else {
    if (!state.url.includes('/auth')) {
      router.navigate(['/auth'], { replaceUrl: true });
      return false;
    }
    return true; // Allow access to login page
  }
};
