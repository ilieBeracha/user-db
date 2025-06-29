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
    <div class="flex flex-col h-full text-white p-2">
      <!-- Header -->
      <div class="p-3  backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg font-medium text-gray-300">AI Assistant</span>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 h-full flex flex-col">
        <div
          *ngIf="messages.length === 0"
          class="flex items-center justify-center h-full bg-gray-[#1e1e1e]"
        >
          <div class="text-center space-y-3 opacity-60 h-full">
            <div class="text-4xl">💬</div>
            <p class="text-gray-500">
              Start a conversation about your database
            </p>
            <div class="text-xs text-gray-500 space-y-1 h-full">
              <p>Try: "Show me all tables"</p>
              <p>Or: "Count users in the database"</p>
            </div>
          </div>
        </div>

        <div
          *ngFor="let msg of messages"
          class="flex h-full bg-gray-[#1e1e1e]"
          [ngClass]="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div class="max-w-[80%] space-y-2">
            <div
              class="text-xs text-gray-500 px-2 bg-gray-[#1e1e1e]"
              [ngClass]="msg.role === 'user' ? 'text-right' : 'text-left'"
            >
              {{ msg.role === 'user' ? 'You' : 'Assistant' }}
            </div>
            <div
              [ngClass]="{
                'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl rounded-br-md shadow-lg':
                  msg.role === 'user',
                'bg-gray-800/80 border border-gray-700/50 text-gray-100 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm':
                  msg.role === 'assistant'
              }"
              class="px-4 py-3 text-sm leading-relaxed h-full"
            >
              <div class="whitespace-pre-wrap">{{ msg.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t border-gray-700/50 backdrop-blur-sm ">
        <div class="flex gap-3 items-end">
          <div class="flex-1 relative">
            <input
              [(ngModel)]="currentMessage"
              placeholder="Ask about tables, data, relationships..."
              class="w-full px-4 py-3 text-sm  bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
              (keydown.enter)="sendMessage()"
              [disabled]="isLoading"
            />
            <div
              *ngIf="isLoading"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <div
                class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"
              ></div>
            </div>
          </div>
          <button
            (click)="sendMessage()"
            [disabled]="!currentMessage.trim() || isLoading"
            class="px-6 py-3 font-medium text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span *ngIf="!isLoading">Send</span>
            <span *ngIf="isLoading">•••</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AiGenComponent {
  currentMessage = '';
  messages: Message[] = [];
  isLoading = false;

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage = this.currentMessage;
    this.messages.push({ role: 'user', content: userMessage });
    this.currentMessage = '';
    this.isLoading = true;

    // Simulate assistant response with more realistic delay
    return this.messages;
  }
}
