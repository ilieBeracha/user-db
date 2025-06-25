import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-gen',
  imports: [CommonModule, MonacoEditorModule, FormsModule],
  styleUrl: './ai-gen.component.css',
  templateUrl: './ai-gen.component.html',
})
export class AiGenComponent {
  protected userDb = inject(UserDb);
  protected databasesInServer = toSignal(this.userDb.getDatabasesInServer());
}
