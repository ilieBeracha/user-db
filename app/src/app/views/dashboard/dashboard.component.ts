import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';
import { User } from '../../../types/user';
import { UserDb } from '../../core/user-db';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDbDialogComponentComponent } from '../../components/user-db-dialog-component/user-db-dialog-component.component';
import { DashboardSummaryComponent } from '../../components/dashboard-summary/dashboard-summary.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DashboardSummaryComponent,
  ],
})
export class DashboardComponent implements OnInit {
  protected auth = inject(Auth);
  protected userDb = inject(UserDb);
  protected dialog = inject(MatDialog);
  protected isLoggedIn = this.auth.isAuthenticated;

  ngOnInit(): void {
    this.userDb.getUserDbStats().subscribe((stats) => {
      this.stats = stats;
    });
  }

  protected stats: any;

  protected user = this.auth.getUser() as User;
  protected userEmail = this.user?.email;
}
