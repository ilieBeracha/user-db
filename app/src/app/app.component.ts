import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import * as monaco from 'monaco-editor';
import { Chart, registerables } from 'chart.js';
import CommonUtils from './core/utils';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CommonUtils, MonacoEditorModule],
  standalone: true,
})
export class AppComponent {
  title = 'angular-dashboard';
}
