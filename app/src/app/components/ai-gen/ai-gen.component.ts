import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-gen',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './ai-gen.component.css',
  templateUrl: './ai-gen.component.html',
})
export class AiGenComponent {
  private fb = inject(FormBuilder);
  protected form: FormGroup;

  protected userDb = inject(UserDb);
  protected databasesInServer = toSignal(this.userDb.getDatabasesInServer());
  protected firstName = '';
  protected lastName = '';
  protected message = `Hello! ${this.firstName} ${this.lastName}`;
  protected isGenerating = false;
  protected selectedFeatures = '';
  protected selectedComplexity = '';
  protected description = '';
  protected selectedDatabaseType = '';
  protected selectedDatabaseName = '';
  protected selectedDatabaseDescription = '';
  protected selectedDatabaseSchema = '';
  constructor() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    console.log(this.databasesInServer());
  }

  protected generateDatabase() {
    this.isGenerating = true;
    this.description = this.form.value.description;
    this.isGenerating = false;
  }
}
