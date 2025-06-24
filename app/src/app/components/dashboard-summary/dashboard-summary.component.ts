import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard-summary',
  imports: [MatCardModule, CommonModule],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.css',
})
export class DashboardSummaryComponent {
  @Input() stats: any;
}
