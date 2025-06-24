import {
  ChangeDetectionStrategy,
  Component,
  input,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgFor } from '@angular/common';
import { AiGenComponent } from '../ai-gen/ai-gen.component';

@Component({
  selector: 'app-dashboard-databases',
  standalone: true,
  imports: [MatCardModule, CommonModule, AiGenComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard-databases.component.html',
})
export class DashboardDatabasesComponent {
  readonly selectedDatabases = input<any>();
}
