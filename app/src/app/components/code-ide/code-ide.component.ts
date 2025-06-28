import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import * as monaco from 'monaco-editor';
import { ThemeService, ThemeInfo } from '../../services/theme.service';

@Component({
  selector: 'app-code-ide',
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './code-ide.component.html',
  styleUrl: './code-ide.component.css',
})
export class CodeIdeComponent implements AfterViewInit, OnDestroy {
  constructor(private themeService: ThemeService) {}

  async ngAfterViewInit() {
    if (this.editorElement) {
      let theme = 'vs-dark'; // fallback
      try {
        await this.themeService.loadTheme('spotify');
        await this.themeService.setTheme('spotify');
        theme = 'spotify';
        console.log('IDLE theme loaded successfully');
      } catch (error) {
        console.error('Failed to load Spotify theme, using vs-dark:', error);
      }

      this.editor = monaco.editor.create(this.editorElement.nativeElement, {
        value: this.code,
        theme: theme,
        language: 'sql',
        fontSize: 14,
        padding: { top: 20, bottom: 20 },
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
      });

      this.editor.onDidChangeModelContent(() => {
        this.code = this.editor?.getValue() || '';
      });
    }
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  @ViewChild('editorElement') editorElement!: ElementRef<HTMLElement>;
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'dbml',
    fontSize: 14,
    minimap: { enabled: false, side: 'right' },
    padding: { top: 20, bottom: 20 },
    automaticLayout: true,
  };

  code = 'SELECT * FROM users LIMIT 10;';

  // Simple UI state
  showResults = false;
  isExecuting = false;
  queryError: string | null = null;

  executeQuery() {
    if (this.editor) {
      this.code = this.editor.getValue();
    }
    this.isExecuting = true;
    this.queryError = null;

    setTimeout(() => {
      this.isExecuting = false;
      this.showResults = true;
      console.log('Execute query:', this.code);
    }, 1000);
  }

  formatQuery() {
    if (this.editor) {
      const formatted = this.code.replace(/\s+/g, ' ').trim();
      this.editor.setValue(formatted);
      this.code = formatted;
    }
  }

  saveQuery() {
    if (this.editor) {
      this.code = this.editor.getValue();
    }
    console.log('Save query:', this.code);
  }

  exportResults() {
    console.log('Export results');
  }
}
