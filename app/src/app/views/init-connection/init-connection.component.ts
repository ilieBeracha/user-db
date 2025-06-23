import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDb } from '../../core/user-db';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-init-connection',
  imports: [ReactiveFormsModule],
  templateUrl: './init-connection.component.html',
  styleUrl: './init-connection.component.css',
})
export class InitConnectionComponent implements OnInit {
  protected dialog = inject(MatDialog);
  protected userDb = inject(UserDb);
  protected fb = inject(FormBuilder);
  protected router = inject(Router);

  protected form: FormGroup = this.fb.group({
    host: ['', Validators.required],
    port: [5432, Validators.required],
    user: ['', Validators.required],
    password: ['', Validators.required],
    database: ['', Validators.required],
    ssl: [false],
  });

  ngOnInit(): void {
    // Check if connection already exists without triggering navigation
    this.userDb.getConnection().subscribe((connection) => {
      if (connection) {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }
    });
  }

  protected onSubmit() {
    if (this.form.valid) {
      this.userDb.connect(this.form.value).subscribe((response) => {
        if (response) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        }
      });
    }
  }
}
