import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';
import { User } from '../../../types/user';
import { UserDb } from '../../core/user-db';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDbDialogComponentComponent } from '../../components/user-db-dialog-component/user-db-dialog-component.component';
import { DashboardStatsComponent } from '../../components/dashboard-stats/dashboard-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DashboardStatsComponent,
  ],
})
export class DashboardComponent {
  protected auth = inject(Auth);
  protected userDb = inject(UserDb);
  protected dialog = inject(MatDialog);
  protected isLoggedIn = this.auth.isAuthenticated;

  protected user = this.auth.getUser() as User;
  protected userEmail = this.user?.email;

  protected openDialog() {
    const dialogRef = this.dialog.open(UserDbDialogComponentComponent, {
      width: '500px',
      panelClass: 'user-db-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userDb.connect({
          host: result.host,
          port: result.port,
          user: result.user,
          password: result.password,
          database: result.database,
          ssl: result.ssl,
        });
      }
    });
  }
}
