import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { CodeIdeComponent } from '../../components/code-ide/code-ide.component';

@Component({
  selector: 'app-ai',
  imports: [
    CodeIdeComponent,
    MatGridListModule,
    NzSplitterModule,
    NzCodeEditorModule,
    NzSwitchModule,
  ],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css',
})
export class AiComponent {}
