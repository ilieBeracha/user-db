import { computed, inject, Injectable, signal } from '@angular/core';
import { DbUserService } from '../../services/dbUserService';
import { tap } from 'rxjs';
import { connectUserDbDto } from '../../services/dbUserService';
import { RecentQueryFeed } from '../../../../shared/types/user-db';

@Injectable({
  providedIn: 'root',
})
export class UserDb {
  private dbUserService = inject(DbUserService);
  private userDbConnection = signal<any>(null);
  private tablesInDatabase = signal<any[]>([]);
  private userDbStats = signal<any>(null);
  private databasesInServer = signal<any[]>([]);
  private recentQueryFeed = signal<RecentQueryFeed[]>([]);

  getConnection() {
    return this.dbUserService.getConnection().pipe(
      tap((response) => {
        this.userDbConnection.set(response);
        return response;
      })
    );
  }

  connect(dto: connectUserDbDto) {
    return this.dbUserService.connect(dto).pipe(
      tap((response) => {
        this.userDbConnection.set(response);
        return response;
      })
    );
  }

  getDatabasesInServer() {
    return this.dbUserService.getDatabasesInServer().pipe(
      tap((response) => {
        this.databasesInServer.set(response);
        return response;
      })
    );
  }

  getTablesInDatabase(database: string) {
    return this.dbUserService.getTablesInDatabase(database).pipe(
      tap((response) => {
        this.tablesInDatabase.set(response.tables);
        return response;
      })
    );
  }

  getUserDbStats() {
    return this.dbUserService.getUserDbStats().pipe(
      tap((response) => {
        this.userDbStats.set(response);
        return response;
      })
    );
  }

  getRecentQueryFeed() {
    return this.dbUserService.getRecentQueryFeed().pipe(
      tap((response) => {
        this.recentQueryFeed.set(response);
        return response;
      })
    );
  }

  getUserDbStatsValue() {
    return computed(() => this.userDbStats());
  }

  getTablesInDatabaseValue() {
    return computed(() => this.tablesInDatabase());
  }

  getDatabasesInServerValue() {
    return computed(() => this.databasesInServer());
  }

  getConnectionValue() {
    return computed(() => !!this.userDbConnection());
  }
    }
