import {
  Component,
  computed,
  effect,
  inject,
  input,
  Input,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserDb } from '../../core/user-db';
@Component({
  selector: 'app-dashboard-summary',
  imports: [MatCardModule, CommonModule],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.css',
})
export class DashboardSummaryComponent {
  protected userDb = inject(UserDb);
  protected selectedDatabases = toSignal(this.userDb.getDatabasesInServer());
  protected top1DbSizes = computed(
    () => this.selectedDatabases()?.[0]?.size_bytes
  );
}
