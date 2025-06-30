import { computed, inject, Injectable, signal } from '@angular/core';
import { DbUserService } from '../../services/dbUserService';
import { take, tap } from 'rxjs';
import { connectUserDbDto } from '../../services/dbUserService';
import { Agents } from './ai';

@Injectable({
  providedIn: 'root',
})
export class UserDb {
  private dbUserService = inject(DbUserService);
  userDbConnection = signal<any>(null);
  recentActivities = signal<any[]>([]);
  messages = signal<any[]>([]);
  schemaExplorer = signal<{ reaponse: any[]; query: string }>({
    reaponse: [],
    query: '',
  });
  agents = inject(Agents);
  getConnection() {
    console.log('Getting Connection');
    return this.dbUserService.getConnection().pipe(
      tap((response) => {
        this.userDbConnection.set(response);
        console.log('Connection Response:', response);
        return response;
      })
    );
  }

  connect(dto: connectUserDbDto) {
    return this.dbUserService.connect(dto);
  }

  getSchemaExplorer() {
    return this.dbUserService.getSchemaExplorer().pipe(
      take(1),
      tap((response) => {
        this.schemaExplorer.set(response);
        this.agents.currentQuery.set({
          query: response.query,
          results: response.results,
        });
        console.log('Schema Explorer Response:', response);
        return response;
      })
    );
  }

  getRecentActivities() {
    return this.dbUserService.getRecentActivities().pipe(
      take(1),
      tap((response) => {
        this.recentActivities.set(response);
        return response;
      })
    );
  }
}
