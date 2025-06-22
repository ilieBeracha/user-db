import { inject, Injectable, signal } from '@angular/core';
import { DbUserService } from '../../services/dbUserService';
import { tap } from 'rxjs';
import { connectUserDbDto } from '../../services/dbUserService';

@Injectable({
  providedIn: 'root',
})
export class UserDb {
  private dbUserService = inject(DbUserService);
  private userDbConnection = signal<any>(null);

  connect(dto: connectUserDbDto) {
    return this.dbUserService.connect(dto).pipe(
      tap((response) => {
        this.userDbConnection.set(response);
        console.log(this.userDbConnection());
        return response;
      })
    );
  }
}
