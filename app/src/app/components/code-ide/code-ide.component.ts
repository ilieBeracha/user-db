import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-code-ide',
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './code-ide.component.html',
  styleUrl: './code-ide.component.css',
})
export class CodeIdeComponent {
  editorOptions = {
    theme: 'vs-dark',
    language: 'sql',
    minimap: { enabled: false },
    padding: { top: 20, bottom: 20 },
    automaticLayout: true,
  };

  code = 'SELECT * FROM users LIMIT 10;';

  // Simple UI state
  showResults = false;
  isExecuting = false;
  queryError: string | null = null;

  executeQuery() {
    console.log('Execute query:', this.code);
  }

  formatQuery() {
    console.log('Format query');
  }

  saveQuery() {
    console.log('Save query');
  }

  exportResults() {
    console.log('Export results');
  }
}
