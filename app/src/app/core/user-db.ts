import { computed, inject, Injectable, signal } from '@angular/core';
import { DbUserService } from '../../services/dbUserService';
import { tap } from 'rxjs';
import { connectUserDbDto } from '../../services/dbUserService';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserDb {
  private dbUserService = inject(DbUserService);
  private userDbConnection = signal<any>(null);
  private tablesInDatabase = signal<any[]>([]);
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

  getConnectionValue() {
    return computed(() => !!this.userDbConnection());
  }

  getDatabasesInServer() {
    return this.dbUserService.getDatabasesInServer().pipe(
      tap((response) => {
        console.log(response.databases);
        return response;
      })
    );
  }

  getTablesInDatabase(database: string) {
    return this.dbUserService.getTablesInDatabase(database).pipe(
      tap((response) => {
        console.log(response.tables);
        this.tablesInDatabase.set(response.tables);
        return response;
      })
    );
  }
}
