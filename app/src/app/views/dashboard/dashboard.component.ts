import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';
import { User } from '../../../types/user';
import { UserDb } from '../../core/user-db';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardDatabasesComponent } from '../../components/dashboard-databases/dashboard-databases.component';
import { toSignal } from '@angular/core/rxjs-interop';
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
  ],
})
export class DashboardComponent {
  protected auth = inject(Auth);
  protected userDb = inject(UserDb);
  protected dialog = inject(MatDialog);
  protected isLoggedIn = this.auth.isAuthenticated;
  protected user = this.auth.getUser() as User;
  protected userEmail = this.user?.email;

  protected selectedDatabases = toSignal(this.userDb.getDatabasesInServer());
  constructor() {
    effect(() => {
      console.log(this.selectedDatabases());
    });
  }
}
