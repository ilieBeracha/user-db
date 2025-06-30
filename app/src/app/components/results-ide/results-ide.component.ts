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
import { Agents } from '../../core/ai';

@Component({
  selector: 'app-results-ide',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './results-ide.component.css',
  template: `
    <div class="flex flex-col h-full py-2 text-white relative bg-black/80">
      <!-- <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-1/12 left-1/8 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-1/12 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 rounded-full blur-3xl"
        ></div>
      </div> -->
      <!-- Header with Toggle Buttons -->
      <div
        class="flex items-center justify-between h-14 px-4 border-b border-slate-700"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg font-medium text-slate-300">IDE</span>
        </div>

        <!-- Toggle Buttons -->
        <div class="flex items-center rounded-lg p-1">
          <button
            (click)="setMode('results')"
            [class.active]="!isQuery"
            class="mode-toggle px-3 py-1.5 text-sm font-medium rounded-md transition-all"
          >
            Results
          </button>
          <button
            (click)="setMode('query')"
            [class.active]="isQuery"
            class="mode-toggle px-3 py-1.5 text-sm font-medium rounded-md transition-all"
          >
            Query
          </button>
        </div>
      </div>

      <!-- Monaco Editor Container -->
      <div class="flex-1 relative">
        <div #editorElement class="w-full h-full"></div>
      </div>

      <!-- Status Bar -->
      <div class="p-2 border-t ">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-4">
            <span class="text-slate-400">Lines: {{ lineCount }}</span>
            <span class="text-slate-400"
              >Size: {{ formatSize(response.length) }}</span
            >
            <span class="text-slate-400"
              >Mode: {{ isQuery ? 'Query' : 'Results' }}</span
            >
          </div>
          @if (isQuery) {
          <div class="flex items-center gap-2" *ngIf="hasErrors">
            <div *ngIf="hasErrors" class="flex items-center gap-1 text-red-400">
              <span>❌</span>
              <span>JSON has errors</span>
            </div>
            <div
              *ngIf="!hasErrors && response.trim()"
              class="flex items-center gap-1 text-green-400"
            >
              <span>✅</span>
              <span>Valid JSON</span>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ResultsIdeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  agents = inject(Agents);
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('editorElement', { static: true }) editorElement!: ElementRef;
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  response: string = '';
  isValidJson: boolean = false;
  hasErrors: boolean = false;
  lineCount: number = 1;
  isQuery: boolean = false;

  constructor(private themeService: ThemeService) {
    effect(() => {
      if (this.isQuery) {
        this.response = JSON.stringify(
          this.agents.currentQuery().query,
          null,
          2
        );
      } else {
        this.response = JSON.stringify(
          this.agents.currentQuery().results,
          null,
          2
        );
      }
      this.editor?.setValue(this.response);
    });
  }

  async ngOnInit() {
    await this.initializeEditor();
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  ngOnChanges() {
    if (this.isQuery) {
      this.response = JSON.stringify(this.agents.currentQuery().query, null, 2);
    } else {
      this.response = JSON.stringify(
        this.agents.currentQuery().results,
        null,
        2
      );
    }
    if (this.editor && this.value !== this.response) {
      this.editor.setValue(this.response);
    }
  }

  private async initializeEditor() {
    // Set Monaco environment
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function (moduleId: string, label: string) {
        if (label === 'json') {
          return './assets/monaco-editor/esm/vs/language/json/json.worker.js';
        }
        if (label === 'sql') {
          return './assets/monaco-editor/esm/vs/language/sql/sql.worker.js';
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

    this.response = this.value || JSON.stringify(defaultJson, null, 2);

    // Load and set IDLE theme
    let theme = 'spacecadet'; // fallback
    try {
      await this.themeService.loadTheme('spacecadet');
      await this.themeService.setTheme('spacecadet');
      console.log('IDLE theme loaded successfully');
    } catch (error) {
      console.error('Failed to load IDLE theme, using vs-dark:', error);
    }

    // Create Monaco editor
    this.editor = monaco.editor.create(this.editorElement.nativeElement, {
      value: this.response,
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
      this.response = this.editor!.getValue();
      this.updateStatus();
      this.valueChange.emit(this.response);
    });

    // Listen for marker changes (validation errors)
    monaco.editor.onDidChangeMarkers(() => {
      if (this.editor) {
        const model = this.editor.getModel();
        if (model) {
          const markers = monaco.editor.getModelMarkers({
            resource: model.uri,
            owner: 'json',
            take: 1,
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
      if (this.response.trim()) {
        JSON.parse(this.response);
        this.isValidJson = true;
      } else {
        this.isValidJson = false;
      }
    } catch (error) {
      this.isValidJson = false;
    }
  }

  formatResponse() {
    if (!this.editor || !this.isValidJson) return;

    try {
      const parsed = JSON.parse(this.response);
      const formatted = JSON.stringify(parsed, null, 2);
      this.editor.setValue(formatted);
    } catch (error) {
      console.error('Failed to format JSON:', error);
    }
  }

  async copyResponse() {
    try {
      await navigator.clipboard.writeText(this.response);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.response;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  setMode(mode: 'query' | 'results') {
    this.isQuery = mode === 'query';
    this.updateEditorContent();
    this.updateEditorLanguage();
  }

  private updateEditorContent() {
    if (this.isQuery) {
      const queryData = this.agents.currentQuery().query;
      this.response =
        typeof queryData === 'string'
          ? queryData
          : JSON.stringify(queryData, null, 2);
    } else {
      const resultsData = this.agents.currentQuery().results;
      this.response = JSON.stringify(resultsData, null, 2);
    }

    if (this.editor) {
      this.editor.setValue(this.response);
      this.updateStatus();
    }
  }

  private updateEditorLanguage() {
    if (this.editor) {
      const model = this.editor.getModel();
      if (model) {
        if (this.isQuery) {
          // Set language to SQL if it's a query
          monaco.editor.setModelLanguage(model, 'sql');
        } else {
          // Set language to JSON if it's results
          monaco.editor.setModelLanguage(model, 'json');
        }
      }
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
