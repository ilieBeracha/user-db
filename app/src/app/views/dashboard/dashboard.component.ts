import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';
import { User } from '../../../types/user';
import { UserDb } from '../../core/user-db';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardDatabasesComponent } from '../../components/dashboard-databases/dashboard-databases.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardActivitiesComponent } from '../../components/dashboard-activities/dashboard-activities.component';
import { DashboardComparisonComponent } from '../../components/dashboard-comparison/dashboard-comparison.component';
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
    DashboardDatabasesComponent,
    DashboardActivitiesComponent,
    DashboardComparisonComponent,
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

  protected databasesInServer = toSignal(this.userDb.getDatabasesInServer());
  protected recentActivities = toSignal(this.userDb.getRecentActivities());
  protected comparisonData = toSignal(this.userDb.getComparisonData());

  constructor() {
    effect(() => {
      console.log(this.databasesInServer());
      console.log(this.recentActivities());
      console.log(this.comparisonData());
    });
  }
}
