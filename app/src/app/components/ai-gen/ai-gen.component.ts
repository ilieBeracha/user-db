import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-ai-gen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './ai-gen.component.css',
  template: `
    <div class="flex flex-col h-full max-h-screen px-4">
      <!-- Header -->
      <div class="py-4 text-center  p-4 flex flex-col gap-2 ">
        <span
          class="text-lg  font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-white rounded-2xl"
        >
          Database Assistant
        </span>
        <span
          class="text-sm bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Ask me anything about your database
        </span>
      </div>

      <!-- Chat History -->
      <div
        class="flex-1 overflow-y-auto space-y-4 bg-zinc-100/10 min-h-[300px] rounded-2xl"
      >
        <div
          *ngFor="let msg of messages"
          class="max-w-xl mx-auto rounded-2xl"
          [ngClass]="{
            'text-right': msg.role === 'user',
            'text-left': msg.role === 'assistant'
          }"
        >
          <div
            [ngClass]="{
              'bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl':
                msg.role === 'user',
              'bg-zinc-200  dark:bg-zinc-800 dark:text-zinc-100 rounded-tl-xl rounded-tr-xl rounded-br-xl':
                msg.role === 'assistant'
            }"
            class="inline-block px-4 py-2 text-sm"
          >
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4">
        <div class="flex gap-2">
          <input
            [(ngModel)]="currentMessage"
            placeholder="Ask about your database..."
            class="flex-1 px-3 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            (keydown.enter)="sendMessage()"
          />
          <button
            (click)="sendMessage()"
            class="px-4 py-2 text-sm font-semibold text-white rounded bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AiGenComponent {
  currentMessage = '';
  messages: Message[] = [];

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.currentMessage });

    // Simulate assistant response (replace with actual logic later)
    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: `You asked about: "${this.currentMessage}"`,
      });
    }, 300);

    this.currentMessage = '';
  }
}
