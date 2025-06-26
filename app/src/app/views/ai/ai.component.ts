import { Component, computed, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { CodeIdeComponent } from '../../components/code-ide/code-ide.component';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';
import { SchemaTreeComponent } from '../../components/schema-tree/schema-tree.component';
import { AiGenComponent } from '../../components/ai-gen/ai-gen.component';

@Component({
  selector: 'app-ai',
  imports: [
    CodeIdeComponent,
    MatGridListModule,
    NzSplitterModule,
    NzCodeEditorModule, 
    NzSwitchModule,
    SchemaTreeComponent,
    AiGenComponent,
  ],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css',
})
export class AiComponent {
  userDb = inject(UserDb);

  protected schemaExplorer = toSignal(this.userDb.getSchemaExplorer());
}
