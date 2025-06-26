import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-gen',
  imports: [CommonModule, FormsModule],
  styleUrl: './ai-gen.component.css',
  template: `
    <div class="flex flex-col h-full ">
      <!-- Chat Area -->
      <div class="flex-1 p-4 overflow-y-auto">
        <div class="text-center py-12">
          <h3 class="text-lg font-medium text-blue-400 mb-2">
            Database Assistant
          </h3>
          <p class="text-sm text-zinc-400">Ask me about your database</p>
        </div>
      </div>

      <!-- Message Input -->
      <div class="border-t border-indigo-900 p-4 ">
        <div class="flex gap-2">
          <input
            [(ngModel)]="currentMessage"
            placeholder="Ask about your database..."
            class="flex-1 px-3 py-2 text-sm border border-indigo-700 rounded bg-slate-700 text-gray-100 placeholder-gray-400"
          />
          <button
            (click)="sendMessage()"
            class="px-4 py-2 bg-indigo-600 text-white rounded"
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

  sendMessage() {
    console.log('Send message:', this.currentMessage);
    this.currentMessage = '';
  }
}
