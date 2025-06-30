import { Component, effect, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDb } from '../../core/user-db';
import { Agents } from '../../core/ai';

@Component({
  selector: 'app-response-table',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './response-table-component.html',
  styleUrl: './response-table-component.css',
})
export class ResponseTableComponent {
  @Input() data: any[] = [];
  currentQueryResults: any = [];
  agents = inject(Agents);
  constructor() {
    effect(() => {
      this.currentQueryResults = this.agents.currentQuery();
      console.log(this.currentQueryResults);
    });
  }

  getTableData() {
    if (!this.currentQueryResults) {
      return { headers: [], rows: [] };
    }

    // Handle different JSON structures
    let dataToProcess = this.currentQueryResults;

    // If it's an object with a data property (common API response pattern)
    if (
      typeof this.currentQueryResults === 'object' &&
      !Array.isArray(this.currentQueryResults)
    ) {
      if (
        this.currentQueryResults.data &&
        Array.isArray(this.currentQueryResults.data)
      ) {
        dataToProcess = this.currentQueryResults.data;
      } else if (
        this.currentQueryResults.results &&
        Array.isArray(this.currentQueryResults.results)
      ) {
        dataToProcess = this.currentQueryResults.results;
      } else if (
        this.currentQueryResults.rows &&
        Array.isArray(this.currentQueryResults.rows)
      ) {
        dataToProcess = this.currentQueryResults.rows;
      } else {
        // Single object - convert to array
        dataToProcess = [this.currentQueryResults];
      }
    }

    // If still not an array, try to convert
    if (!Array.isArray(dataToProcess)) {
      dataToProcess = [dataToProcess];
    }

    // If empty array
    if (dataToProcess.length === 0) {
      return { headers: [], rows: [] };
    }

    // Get all possible headers from all objects
    const allHeaders = new Set<string>();
    dataToProcess.forEach((item: any) => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach((key) => allHeaders.add(key));
      }
    });

    const tableHeaders = Array.from(allHeaders);

    // If no headers found, create a generic structure
    if (tableHeaders.length === 0) {
      return {
        headers: ['Value'],
        rows: dataToProcess.map((item: any) => [this.formatCellValue(item)]),
      };
    }

    const tableRows = dataToProcess.map((item: any) => {
      return tableHeaders.map((header) =>
        item && typeof item === 'object' ? item[header] : item
      );
    });

    return {
      headers: tableHeaders,
      rows: tableRows,
    };
  }

  formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return `[${value.length} items]`;
      }
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  }
}
