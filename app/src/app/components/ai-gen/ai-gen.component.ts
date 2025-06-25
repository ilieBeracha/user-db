import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({
  selector: 'app-ai-gen',
  imports: [CommonModule, FormsModule, NzCodeEditorModule],
  styleUrl: './ai-gen.component.css',
  template: `
    <nz-code-editor
      class="editor"
      [ngModel]="code"
      [nzEditorOption]="{ language: 'typescript', theme: 'vs-dark' }"
    ></nz-code-editor>
  `,
  styles: [
    `
      .editor {
        height: 100%;
        width: 100%;
        background-color: #222222;
      }
    `,
  ],
})
export class AiGenComponent {
  protected userDb = inject(UserDb);
  protected databasesInServer = toSignal(this.userDb.getDatabasesInServer());
  code = '';
}
