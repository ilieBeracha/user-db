import { Component, inject } from '@angular/core';
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
  isScreenSmall = false;
  protected router = inject(Router);
  mode = new FormControl<MatDrawerMode>('side');

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((result) => result.matches))
      .subscribe((matches) => {
        this.isScreenSmall = matches;
      });

    this.getDatabasesInServer();
    this.getTablesInDatabase('cms-editor');
    this.getUserDbStats();
    this.getRecentQueryFeed();
  }

  protected getDatabasesInServer() {
    this.userDb.getDatabasesInServer().subscribe((databases) => {
      console.log(databases);
    });
  }

  protected getTablesInDatabase(database: string) {
    this.userDb.getTablesInDatabase(database).subscribe((tables) => {
      console.log(tables);
    });
  }

  protected getUserDbStats() {
    this.userDb.getUserDbStats().subscribe((stats) => {
      console.log(stats);
    });
  }

  protected getRecentQueryFeed() {
    this.userDb.getRecentQueryFeed().subscribe((feed) => {
      console.log(feed);
    });
  }
}
