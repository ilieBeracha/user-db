import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';
import { User } from '../../../types/user';
import { UserDb } from '../../core/user-db';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardChartComponent } from '../../components/dashboard-chart/dashboard-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DashboardChartComponent,
  ],
})
export class DashboardComponent {
  protected auth = inject(Auth);
  protected userDb = inject(UserDb);
  protected dialog = inject(MatDialog);
  protected user = this.auth.getUser() as User;
  protected isLoggedIn = this.auth.isAuthenticated;
  protected userEmail = this.user?.email;

  // protected databasesInServer = toSignal(this.userDb.getDatabasesInServer());
  protected recentActivities = toSignal(this.userDb.getRecentActivities());
  // protected comparisonData = toSignal(this.userDb.getComparisonData());
}
