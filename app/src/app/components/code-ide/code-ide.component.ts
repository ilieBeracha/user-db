import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal,
  Output,
  EventEmitter,
  inject,
  OnInit,
  effect,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import * as monaco from 'monaco-editor';
import { ThemeService } from '../../services/theme.service';
import { UserDb } from '../../core/user-db';
import { Agents } from '../../core/ai';

@Component({
  selector: 'app-code-ide',
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './code-ide.component.html',
  styleUrl: './code-ide.component.css',
})
export class CodeIdeComponent implements OnInit, OnDestroy, OnChanges {
  userDb = inject(UserDb);
  agents = inject(Agents);
  editorValue = '';

  @Output() triggerQuery = new EventEmitter<any>();

  constructor(private themeService: ThemeService) {
    effect(() => {
      this.editorValue = this.agents.currentQuery().query;
      this.editor?.setValue(this.editorValue);
    });
  }

  async ngOnInit() {
    if (this.editorElement) {
      let theme = 'vs-dark'; // fallback
      try {
        await this.themeService.loadTheme('spotify');
        await this.themeService.setTheme('spotify');
        theme = 'spotify';
        console.log('Spotify theme loaded successfully');
      } catch (error) {
        console.error('Failed to load Spotify theme, using vs-dark:', error);
      }

      this.editor = monaco.editor.create(this.editorElement.nativeElement, {
        value: this.editorValue,
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
        tabSize: 2,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
      });

      this.editor.onDidChangeModelContent(() => {
        this.editorValue = this.editor?.getValue() || '';
      });
    }
  }

  ngOnChanges() {
    if (this.editor) {
      this.editor.setValue(this.editorValue);
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

  // Simple UI state
  showResults = false;
  isExecuting = false;
  queryError: string | null = null;

  executeQuery() {
    if (this.editor) {
      this.editorValue = this.editor.getValue();
    }
    this.triggerQuery.emit(this.editorValue);
    this.isExecuting = true;
    this.queryError = null;

    setTimeout(() => {
      this.isExecuting = false;
      this.showResults = true;
      console.log('Execute query:', this.editorValue);
    }, 1000);
  }

  formatQuery() {
    if (this.editor) {
      const formatted = this.editorValue.replace(/\s+/g, ' ').trim();
      this.editor.setValue(formatted);
      this.editorValue = formatted;
    }
  }

  saveQuery() {
    if (this.editor) {
      this.editorValue = this.editor.getValue();
    }
    console.log('Save query:', this.editorValue);
  }

  exportResults() {
    console.log('Export results');
  }
}
