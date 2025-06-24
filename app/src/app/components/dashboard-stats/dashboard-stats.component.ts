import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-dashboard-stats',
  imports: [NgFor],
  standalone: true,
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css',
})
export class DashboardStatsComponent {
  stats = [
    {
      title: '100',
      value: 71897,
      percentage: 12,
      icon: 'fa-solid fa-user',
    },
    {
      title: '100',
      value: 71897,
      percentage: 12,
      icon: 'fa-solid fa-user',
    },
    {
      title: '100',
      value: 71897,
      percentage: 12,
      icon: 'fa-solid fa-user',
    },
  ];
}
