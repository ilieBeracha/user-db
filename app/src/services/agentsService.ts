import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from '../app/core/auth';
import { API_URL } from '../app/cosnts';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private auth = inject(Auth);
  constructor(private readonly http: HttpClient) {}
  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`,
      },
    };
  }
  generateSQL(query: string, schema: any) {
    return this.http.post<any>(
      `${API_URL}/agent/chat`,
      { query: query, schema: schema },
      this.getHeaders()
    );
  }
}
