import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as monaco from 'monaco-editor';
import { ThemeService } from '../../services/theme.service';
import { UserDb } from '../../core/user-db';
import { Agents } from '../../core/ai';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './json-editor.component.css',
  template: `
    <div class="flex flex-col h-full py-2 text-[rgb(255, 227, 238)] ">
      <!-- Header -->
      <div
        class="flex items-center justify-center gap-2 h-14  dark:bg-[rgb(255, 227, 238)]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg font-medium text-gray-300"
              >JSON Editor • IDLE Theme</span
            >
          </div>
        </div>
      </div>

      <!-- Monaco Editor Container -->
      <div class="flex-1 relative">
        <div #editorContainer class="w-full h-full"></div>
      </div>

      <!-- Status Bar -->
      <div class="p-2 border-tbackdrop-blur-sm">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-4">
            <span class="text-gray-400">Lines: {{ lineCount }}</span>
            <span class="text-gray-400"
              >Size: {{ formatSize(jsonValue.length) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <div *ngIf="hasErrors" class="flex items-center gap-1 text-red-400">
              <span>❌</span>
              <span>JSON has errors</span>
            </div>
            <div
              *ngIf="!hasErrors && jsonValue.trim()"
              class="flex items-center gap-1 text-green-400"
            >
              <span>✅</span>
              <span>Valid JSON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class JsonEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  agents = inject(Agents);
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  jsonValue: string = '';
  isValidJson: boolean = false;
  hasErrors: boolean = false;
  lineCount: number = 1;

  constructor(private themeService: ThemeService) {
    effect(() => {
      this.jsonValue = JSON.stringify(
        this.agents.currentQuery().results,
        null,
        2
      );
      this.editor?.setValue(this.jsonValue);
    });
  }

  async ngOnInit() {
    this.themeService.setTheme('vs-dark');
    await this.initializeEditor();
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  ngOnChanges() {
    if (this.editor && this.value !== this.jsonValue) {
      this.jsonValue = this.value || '';
      this.editor.setValue(this.jsonValue);
    }
  }

  private async initializeEditor() {
    // Set Monaco environment
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function (moduleId: string, label: string) {
        if (label === 'json') {
          return './assets/monaco-editor/esm/vs/language/json/json.worker.js';
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return './assets/monaco-editor/esm/vs/language/css/css.worker.js';
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return './assets/monaco-editor/esm/vs/language/html/html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
          return './assets/monaco-editor/esm/vs/language/typescript/ts.worker.js';
        }
        return './assets/monaco-editor/esm/vs/editor/editor.worker.js';
      },
    };

    // Default JSON content
    const defaultJson = {
      example: 'data',
      number: 123,
      array: [1, 2, 3],
      nested: {
        property: 'value',
      },
    };

    this.jsonValue = this.value || JSON.stringify(defaultJson, null, 2);

    // Load and set IDLE theme
    let theme = 'vs-dark'; // fallback
    try {
      await this.themeService.loadTheme('idle');
      theme = 'idle';
      console.log('IDLE theme loaded successfully');
    } catch (error) {
      console.error('Failed to load IDLE theme, using vs-dark:', error);
    }

    // Create Monaco editor
    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: this.jsonValue,
      tabSize: 2,
      language: 'json',
      padding: {
        top: 10,
      },
      tabCompletion: 'on',
      theme: theme,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'monospace',
      lineNumbers: 'off',
      renderWhitespace: 'selection',
      wordWrap: 'on',
      folding: true,
      formatOnType: true,
      formatOnPaste: true,
      bracketPairColorization: { enabled: true },
      suggest: {
        showKeywords: false,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
    });

    // Listen for content changes
    this.editor.onDidChangeModelContent(() => {
      this.jsonValue = this.editor!.getValue();
      this.updateStatus();
      this.valueChange.emit(this.jsonValue);
    });

    // Listen for marker changes (validation errors)
    monaco.editor.onDidChangeMarkers(() => {
      if (this.editor) {
        const model = this.editor.getModel();
        if (model) {
          const markers = monaco.editor.getModelMarkers({
            resource: model.uri,
            owner: 'json',
          });
          this.hasErrors = markers.length > 0;
        }
      }
    });

    this.updateStatus();
  }

  private updateStatus() {
    this.lineCount = this.editor?.getModel()?.getLineCount() || 1;

    try {
      if (this.jsonValue.trim()) {
        JSON.parse(this.jsonValue);
        this.isValidJson = true;
      } else {
        this.isValidJson = false;
      }
    } catch (error) {
      this.isValidJson = false;
    }
  }

  formatJson() {
    if (!this.editor || !this.isValidJson) return;

    try {
      const parsed = JSON.parse(this.jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      this.editor.setValue(formatted);
    } catch (error) {
      console.error('Failed to format JSON:', error);
    }
  }

  async copyJson() {
    try {
      await navigator.clipboard.writeText(this.jsonValue);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.jsonValue;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
