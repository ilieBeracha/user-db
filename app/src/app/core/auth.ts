import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../services/authService';
import { User } from '../../types/user';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private authService = inject(AuthService);
  private router = inject(Router);
  private user = signal<JwtPayload | User | null>(null);
  private accessToken = signal<string | null>(
    localStorage.getItem('access') || null
  );

  constructor() {
    this.accessToken.set(localStorage.getItem('access') || null);
    this.user.set(this.authService.jwtDecode(this.accessToken() || ''));
  }

  private isLoading = signal(false);

  login(email: string, password: string) {
    this.authService
      .login(email, password)
      .pipe(
        tap((response) => {
          this.isLoading.set(true);
          this.setTokens(response.access_token, response.refresh_token);
          if (response.access_token && this.isValidJwt(response.access_token)) {
            this.user.set(this.authService.jwtDecode(response.access_token));
          }
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/query-builder'], { replaceUrl: true });
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken.set(accessToken);
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
  }

  isAuthenticated = computed(() => !!this.accessToken());

  logout() {
    this.user.set(null);
    this.accessToken.set(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  getAccessToken() {
    return this.accessToken();
  }

  getUser() {
    return this.user();
  }

  isValidJwt(token: string): boolean {
    return token.split('.').length === 3;
  }
}
