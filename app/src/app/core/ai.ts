import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AgentsService } from '../../services/agentsService';

@Injectable({
  providedIn: 'root',
})
export class Agents {
  private agentsService = inject(AgentsService);
  messages = signal<any[]>([]);

  generateSQL(query: string, schema: any) { 
    return this.agentsService.generateSQL(query, schema).pipe(
      tap((response) => {
        this.messages.set(response);
        return response;
      })
    );
  }
}
