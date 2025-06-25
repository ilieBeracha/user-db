import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-ai',
  imports: [MatGridListModule],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css',
})
export class AiComponent {
  tiles = [
    { text: 'Two', cols: 1, rows: 2, color: '' },
    { text: 'One', cols: 3, rows: 1, color: '' },
    { text: 'Three', cols: 1, rows: 1, color: '' },
    { text: 'Four', cols: 2, rows: 1, color: '' },
  ];
}
