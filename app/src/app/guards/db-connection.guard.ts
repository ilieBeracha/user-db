import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDb } from '../core/user-db';
import { take, switchMap, of } from 'rxjs';

export const DbConnectionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userDb = inject(UserDb);

  return userDb.getConnection().pipe(
    take(1),
    switchMap((connection) => {
      if (!connection) {
        router.navigate(['/init-connection'], { replaceUrl: true });
        return of(false); // ❌ Cancel current navigation
      }
      return of(true); // ✅ Allow
    })
  );
};
