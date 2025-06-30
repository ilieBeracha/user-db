import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agents } from '../../core/ai';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-ai-gen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './ai-gen.component.css',
  templateUrl: './ai-gen.component.html',
})
export class AiGenComponent {
  currentMessage = '';
  messages: Message[] = [];
  isLoading = false;
  agents = inject(Agents);
  userDb = inject(UserDb);

  constructor() {
    effect(() => {
      this.messages = [...this.messages, this.agents.message()];
      console.log(this.messages);
    });
  }

  sendMessage() {
    const userMessage = this.currentMessage;
    this.messages.push({ role: 'user', content: userMessage });
    this.currentMessage = '';
    this.agents.generateSQL(userMessage, this.userDb.schemaExplorer());
  }
}
