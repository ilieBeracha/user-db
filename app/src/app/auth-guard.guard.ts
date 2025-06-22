// src/app/auth-guard.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './core/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  if (auth.isAuthenticated()) {
    // If trying to access login page while authenticated, redirect to home
    if (state.url.includes('/auth')) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true; // Authorized
  } else {
    // If not authenticated and not on the login page, redirect to login
    if (!state.url.includes('/auth')) {
      router.navigate(['/auth']);
      return false;
    }
    return true; // Allow access to login page
  }
};
