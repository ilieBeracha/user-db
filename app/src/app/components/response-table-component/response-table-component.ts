import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-response-table',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './response-table-component.html',
  styleUrl: './response-table-component.css',
})
export class ResponseTableComponent {
  @Input() data: any[] = [];
}
