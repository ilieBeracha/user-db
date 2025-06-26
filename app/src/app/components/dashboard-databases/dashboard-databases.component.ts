import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-databases',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard-databases.component.html',
})
export class DashboardDatabasesComponent {
  readonly databasesInServer = input<any[]>([]);
  protected currentIndex = signal(0);

  protected get currentDatabase() {
    const databases = this.databasesInServer();
    return databases && databases?.length > 0
      ? databases[this.currentIndex()]
      : null;
  }

  protected get totalDatabases() {
    const databases = this.databasesInServer();
    return databases?.length ?? 0;
  }

  protected nextDatabase() {
    const total = this.totalDatabases;
    if (total > 0) {
      this.currentIndex.set((this.currentIndex() + 1) % total);
    }
  }

  protected previousDatabase() {
    const total = this.totalDatabases;
    if (total > 0) {
      this.currentIndex.set((this.currentIndex() - 1 + total) % total);
    }
  }
}
