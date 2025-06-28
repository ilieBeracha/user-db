import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Chart, registerables } from 'chart.js';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MonacoEditorModule],
})
export class AppComponent {
  title = 'angular-dashboard';
}
