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
    { text: 'One', cols: 1, rows: 5, color: '' },
    { text: 'Two', cols: 3, rows: 3, color: '' },
    // { text: 'Three', cols: 1, rows: 1, color: '' },
    { text: 'Four', cols: 2, rows: 2, color: '' },
    { text: 'Five', cols: 1, rows: 2, color: '' },
  ];
}
