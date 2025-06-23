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
  private router = inject(Router);

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
        console.log(this.userDbConnection());
        return response;
      })
    );
  }

  getConnectionValue() {
    return computed(() => !!this.userDbConnection());
  }
}
