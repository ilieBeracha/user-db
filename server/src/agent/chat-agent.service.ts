import { Injectable } from "@nestjs/common";
import { BaseAgentService } from "./base-agent.service";
import {
  ResponseFormatter,
  ChatResponse,
} from "./formatters/response.formatter";

@Injectable()
export class ChatAgentService extends BaseAgentService {
  async chatAboutDatabase(
    message: string,
    userId: string,
    chatHistory?: any[]
  ): Promise<ChatResponse> {
    try {
      const schema = await this.getSchemaContext(userId);

      const prompt = this.buildChatPrompt(message, schema, chatHistory);

      const response = await this.llm.invoke(prompt);
      const aiMessage = response.content.toString();

      const suggestedQueries = this.generateSuggestedQueries(aiMessage, schema);

      return ResponseFormatter.formatChatResponse(
        aiMessage,
        { schema, chatHistory },
        userId,
        suggestedQueries
      );
    } catch (error) {
      return ResponseFormatter.formatChatResponse(
        `Sorry, I encountered an error: ${error.message}`,
        { error: error.message },
        userId
      );
    }
  }

  private buildChatPrompt(
    message: string,
    schema: any[],
    chatHistory?: any[]
  ): string {
    const historyContext = chatHistory?.length
      ? `\nCHAT HISTORY:\n${JSON.stringify(chatHistory.slice(-5), null, 2)}\n`
      : "";

    return `You are a database expert assistant. Help the user understand and work with their database.

USER MESSAGE: ${message}
${historyContext}
DATABASE SCHEMA:
${JSON.stringify(schema, null, 2)}

INSTRUCTIONS:
- Provide helpful, conversational responses about the database
- Explain database concepts clearly
- Suggest relevant queries when appropriate
- Be concise but informative
- If the user asks for data, suggest they use the query generator instead

RESPONSE:`;
  }

  private generateSuggestedQueries(aiMessage: string, schema: any[]): string[] {
    // Simple logic to suggest common queries based on schema
    const suggestions: string[] = [];

    if (schema.length > 0) {
      suggestions.push(`Show all data from ${schema[0].table_name}`);
      suggestions.push("Count rows in all tables");

      if (schema.length > 1) {
        suggestions.push("Find relationships between tables");
      }
    }

    return suggestions.slice(0, 3);
  }
}
