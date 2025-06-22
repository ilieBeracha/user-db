import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';
import { User } from '../../../types/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatCardModule, MatIconModule],
})
export class DashboardComponent {
  protected auth = inject(Auth);

  protected isLoggedIn = this.auth.isAuthenticated;

  protected user = this.auth.getUser() as User;
  protected userEmail = this.user?.email;
}
