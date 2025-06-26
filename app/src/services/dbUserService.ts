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
  constructor(private readonly http: HttpClient) {}

  getConnection() {
    return this.http.get<connectUserDbDto>(
      `${API_URL}/user-db/connection`,
      this.getHeaders()
    );
  }

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`,
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

  getDatabasesInServer() {
    return this.http.get<any>(
      `${API_URL}/user-db/server-databases`,
      this.getHeaders()
    );
  }

  getRecentActivities() {
    const response = this.http.get<any>(
      `${API_URL}/user-db/activities`,
      this.getHeaders()
    );

    return response;
  }

  getComparisonData() {
    return this.http.get<any>(
      `${API_URL}/user-db/comparison`,
      this.getHeaders()
    );
  }

  getSchemaExplorer() {
    return this.http.get<any>(
      `${API_URL}/user-db/schema-explorer`,
      this.getHeaders()
    );
  }
}
