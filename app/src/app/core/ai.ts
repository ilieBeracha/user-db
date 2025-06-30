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
          this.currentQuery.set({
            query: response.query,
            results: response.result,
          });
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}
