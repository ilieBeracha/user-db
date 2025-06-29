import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDb } from '../../core/user-db';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-init-connection',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './init-connection.component.html',
  styleUrl: './init-connection.component.css',
})
export class InitConnectionComponent implements OnInit {
  protected dialog = inject(MatDialog);
  protected userDb = inject(UserDb);
  protected fb = inject(FormBuilder);
  protected router = inject(Router);

  host = '';
  port = 5432;
  user = '';
  password = '';
  database = '';
  ssl = false;

  ngOnInit(): void {
    // Check if connection already exists without triggering navigation
    this.userDb.getConnection().subscribe();
  }

  protected onSubmit() {
    if (this.host && this.port && this.user && this.password && this.database) {
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
          if (response) {
            this.router.navigate(['/query-builder'], { replaceUrl: true });
          }
        });
    }
  }
}
