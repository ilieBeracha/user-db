import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { KeyboardShortcutsService } from '../../core/keyboard-shortcuts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-code-ide',
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './code-ide.component.html',
  styleUrl: './code-ide.component.css',
})
export class CodeIdeComponent implements OnInit, OnDestroy {
  editorOptions = {
    theme: 'vs-dark',
    language: 'sql',
    padding: { top: 20 },
  };
  code: string = 'SELECT * FROM users';
  originalCode: string = 'SELECT * FROM users';

  private shortcuts: Subscription[] = [];

  constructor(private keyboardShortcuts: KeyboardShortcutsService) {}

  ngOnInit() {
    this.shortcuts.push(
      this.keyboardShortcuts.onSave().subscribe(() => {
        console.log('CMD + S pressed anywhere on page!');
        this.saveCode();
      })
    );

    this.shortcuts.push(
      this.keyboardShortcuts.onUndo().subscribe(() => {
        console.log('Undo triggered');
        this.undoChanges();
      })
    );
  }

  ngOnDestroy() {
    this.shortcuts.forEach((sub) => sub.unsubscribe());
  }

  onFocus(event: any) {
    console.log('onFocus', event);
  }

  private saveCode() {
    console.log('Saving code:', this.code);
  }

  private undoChanges() {
    this.code = this.originalCode;
    console.log('Code reverted to original');
  }
}
