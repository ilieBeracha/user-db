import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../types/user';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected router = inject(Router);
  protected BASE_URL = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/auth/login`, {
      email,
      password,
    });
  }

  jwtDecode(token: string) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
