import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AgentsService } from '../../services/agentsService';

@Injectable({
  providedIn: 'root',
})
export class Agents {
  private agentsService = inject(AgentsService);
  message = signal<any>({});
  isLoading = signal(false);
  agentQuery = signal<string>('');
  agentSchema = signal<any>({});
  currentQuery = signal({
    query: '',
    results: [],
  });
  generateSQL(query: string, schema: any) {
    this.isLoading.set(true);
    this.agentsService
      .generateSQL(query, schema)
      .pipe(
        tap((response) => {
          console.log(response);
          this.agentQuery.set(response.query);
          this.agentSchema.set(response.schema);
          this.message.set(response.message);
          
          let parsedResult = response.result;
          try {
            // Try to parse if it's a JSON string
            if (typeof response.result === 'string') {
              parsedResult = JSON.parse(response.result);
            }
          } catch (e) {
            // If parsing fails, keep as string
            parsedResult = response.result;
          }
          
          this.currentQuery.set({
            query: response.query,
            results: parsedResult,
          });
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}
