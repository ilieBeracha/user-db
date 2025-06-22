import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from '../app/cosnts';
import { Auth } from '../app/core/auth';

export interface connectUserDbDto {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DbUserService {
  private auth = inject(Auth);
  private accessToken = this.auth.getAccessToken();
  constructor(private readonly http: HttpClient) {}

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  connect(dto: connectUserDbDto) {
    const response = this.http.post<any>(
      `${API_URL}/user-db/connect`,
      dto,
      this.getHeaders()
    );
    return response;
  }

  getDatabases() {
    const response = this.http.get<any>(
      `${API_URL}/user-db/databases`,
      this.getHeaders()
    );
    return response;
  }
}
