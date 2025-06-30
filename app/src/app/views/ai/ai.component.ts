import { Component, computed, effect, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { CodeIdeComponent } from '../../components/code-ide/code-ide.component';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';
import { SchemaTreeComponent } from '../../components/schema-tree/schema-tree.component';
import { AiGenComponent } from '../../components/ai-gen/ai-gen.component';
import { JsonEditorComponent } from '../../components/json-editor/json-editor.component';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ResponseTableComponent } from '../../components/response-table-component/response-table-component';
import { DashboardActivitiesComponent } from '../../components/dashboard-activities/dashboard-activities.component';
import { Agents } from '../../core/ai';
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
    CommonModule,
    JsonEditorComponent,
    NzTableModule,
    ResponseTableComponent,
    JsonEditorComponent,
    SchemaTreeComponent,
    AiGenComponent,
    DashboardActivitiesComponent,
  ],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css',
})
export class AiComponent {
  userDb = inject(UserDb);
  agents = inject(Agents);
  currentQuery: any = this.agents.currentQuery();
  protected schemaExplorer: any = toSignal(this.userDb.getSchemaExplorer());
  protected recentActivities = toSignal(this.userDb.getRecentActivities());

  triggerQuery(query: string) {
    console.log(query);
  }
}
