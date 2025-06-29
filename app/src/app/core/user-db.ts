import { computed, inject, Injectable, signal } from '@angular/core';
import { DbUserService } from '../../services/dbUserService';
import { take, tap } from 'rxjs';
import { connectUserDbDto } from '../../services/dbUserService';

@Injectable({
  providedIn: 'root',
})
export class UserDb {
  private dbUserService = inject(DbUserService);
  userDbConnection = signal<any>(null);
  databasesInServer = signal<any[]>([]);
  recentActivities = signal<any[]>([]);
  schemaExplorer = signal<{ reaponse: any[]; query: string }>({
    reaponse: [],
    query: '',
  });
  comparisonData = signal<any[]>([]);

  currentQuery = signal({
    query: '',
    results: [],
  });

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

  getDatabasesInServer() {
    return this.dbUserService.getDatabasesInServer().pipe(
      tap((response) => {
        this.databasesInServer.set(response);
        return response;
      })
    );
  }
  getRecentActivities() {
    return this.dbUserService.getRecentActivities().pipe(
      tap((response) => {
        this.databasesInServer.set(response);
        return response;
      })
    );
  }
  getComparisonData() {
    return this.dbUserService.getComparisonData().pipe(
      take(1),
      tap((response) => {
        this.comparisonData.set(response);
        return response;
      })
    );
  }
  getSchemaExplorer() {
    return this.dbUserService.getSchemaExplorer().pipe(
      take(1),
      tap((response) => {
        this.schemaExplorer.set(response);
        this.currentQuery.set({
          query: response.query,
          results: response.results,
        });
        console.log('Schema Explorer Response:', response);
        return response;
      })
    );
  }
  queryDb(prompt: string) {
    return this.dbUserService.getAiResponse(prompt).pipe(
      take(1),
      tap((response) => {
        return response;
      })
    );
  }
  readRecentActivities() {
    return computed(() => this.recentActivities);
  }

  readDatabasesInServer() {
    return computed(() => this.databasesInServer);
  }

  readUserDbConnection() {
    return computed(() => this.userDbConnection);
  }

  readComparisonData() {
    return computed(() => this.comparisonData);
  }

  readSchemaExplorer() {
    return computed(() => this.schemaExplorer);
  }

  readCurrentQuery() {
    return computed(() => this.currentQuery);
  }
}
