import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { UserDb } from '../../core/user-db';

@Component({
  selector: 'app-user-db-dialog-component',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  standalone: true,
  templateUrl: './user-db-dialog-component.component.html',
  styleUrl: './user-db-dialog-component.component.css',
})
export class UserDbDialogComponentComponent {
  protected userDb = inject(UserDb);
  protected dialogRef: MatDialogRef<UserDbDialogComponentComponent> = inject(
    MatDialogRef<UserDbDialogComponentComponent>
  );

  host = '';
  port = 5432;
  user = '';
  password = '';
  database = '';
  ssl = false;

  protected onSubmit() {
    this.userDb
      .connect({
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password,
        database: this.database,
        ssl: this.ssl,
      })
      .subscribe((response) => {
        this.dialogRef.close(response);
      });
  }
}
