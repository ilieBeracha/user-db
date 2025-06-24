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

  getTablesInDatabase(database: string) {
    const response = this.http.get<any>(
      `${API_URL}/user-db/tables?database=${database}`,
      this.getHeaders()
    );
    return response;
  }

  getDatabasesInServer() {
    const response = this.http.get<any>(
      `${API_URL}/user-db/server-databases`,
      this.getHeaders()
    );
    return response;
  }

  getUserDbStats() {
    const response = this.http.get<any>(
      `${API_URL}/user-db/query-stats`,
      this.getHeaders()
    );
    return response;
  }

  getRecentQueryFeed() {
    const response = this.http.get<any>(
      `${API_URL}/user-db/recent-query-feed`,
      this.getHeaders()
    );
    return response;
  }
}
