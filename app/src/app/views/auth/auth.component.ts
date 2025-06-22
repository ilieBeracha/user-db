import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  standalone: true,
})
export class AuthComponent {
  auth = inject(Auth);

  email = '';
  password = '';

  onSubmitForm() {
    this.auth.login(this.email, this.password);
  }
}
