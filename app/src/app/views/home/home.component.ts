import { Component, effect, inject } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Auth } from '../../core/auth';
import { UserDb } from '../../core/user-db';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
  ],
  standalone: true,
})
export class HomeComponent {
  protected auth = inject(Auth);
  protected userDb = inject(UserDb);
  protected databasesInServer = toSignal(this.userDb.getDatabasesInServer());
  isScreenSmall = false;
  protected router = inject(Router);
  // readonly databasesInServer = this.userDb.readDatabasesInServer();
  mode = new FormControl<MatDrawerMode>('side');

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((result) => result.matches))
      .subscribe((matches) => {
        this.isScreenSmall = matches;
      });

    effect(() => {
      console.log(this.databasesInServer());
    });
  }
}
