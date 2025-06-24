import { computed, inject, Injectable, signal } from '@angular/core';
import { DbUserService } from '../../services/dbUserService';
import { tap } from 'rxjs';
import { connectUserDbDto } from '../../services/dbUserService';

@Injectable({
  providedIn: 'root',
})
export class UserDb {
  private dbUserService = inject(DbUserService);
  userDbConnection = signal<any>(null);
  databasesInServer = signal<any[]>([]);

  getConnection() {
    return this.dbUserService.getConnection().pipe(
      tap((response) => {
        this.userDbConnection.set(response);
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

  readDatabasesInServer() {
    return computed(() => this.databasesInServer);
  }

  readUserDbConnection() {
    return computed(() => this.userDbConnection);
  }
}
