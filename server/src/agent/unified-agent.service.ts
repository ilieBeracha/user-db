import { Injectable } from "@nestjs/common";
import { BaseAgentService } from "./base-agent.service";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { GenerateSQLTool } from "./tools/GenerateSQLTool";
import { DatabaseSchemaTool } from "./tools/DatabaseSchemaTool";
import { ExecuteQueryTool } from "./tools/ExecuteQueryTool";
import { RunnableSequence } from "@langchain/core/runnables";
import { Tool } from "@langchain/core/tools";
import {
  ResponseFormatter,
  ChatResponse,
  QueryExecutionResult,
} from "./formatters/response.formatter";

@Injectable()
export class UnifiedAgentService extends BaseAgentService {
  private agentExecutors: Map<string, AgentExecutor> = new Map();

  async getOrCreateAgentExecutor(userId: string): Promise<AgentExecutor> {
    if (this.agentExecutors.has(userId)) {
      return this.agentExecutors.get(userId)!;
    }

    const tools: Tool[] = [
      new GenerateSQLTool(this, userId),
      new DatabaseSchemaTool(this, userId),
      new ExecuteQueryTool(this, userId),
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert database assistant that helps users interact with their PostgreSQL database.

CAPABILITIES:
- Generate and execute SQL queries from natural language
- Provide database schema information
- Execute custom SQL queries
- Explain query results and database concepts
- Remember conversation context

GUIDELINES:
- Always be helpful and provide clear explanations
- Use tools to access real database information
- When users ask about data, use the generate_sql tool
- When users ask about database structure, use the get_database_schema tool
- When users provide SQL, use the execute_sql_query tool
- Provide context and explanations with your responses
- Be conversational but professional
- If you're unsure about something, ask for clarification`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createOpenAIFunctionsAgent({
      llm: this.llm,
      tools,
      prompt,
    });

    const executor = new AgentExecutor({
      agent,
      tools,
      verbose: false,
      maxIterations: 3,
      returnIntermediateSteps: false,
    });

    this.agentExecutors.set(userId, executor);
    return executor;
  }

  async processMessage(
    message: string,
    userId: string,
    chatHistory?: any[],
  ): Promise<ChatResponse> {
    try {
      const executor = await this.getOrCreateAgentExecutor(userId);
      const schema = await this.getSchemaContext(userId);

      // Format chat history for the agent
      const formattedHistory = this.formatChatHistory(chatHistory);

      const result = await executor.invoke({
        input: message,
        chat_history: formattedHistory,
      });

      // Save to memory (with error handling)
      try {
        await this.saveToMemory(message, result.output);
      } catch (error) {
        console.warn('Memory save failed:', error.message);
      }

      // Generate suggested queries based on the conversation
      const suggestedQueries = this.generateSmartSuggestions(
        message,
        result.output,
        schema,
      );

      return ResponseFormatter.formatChatResponse(
        result.output,
        {
          schema,
          chatHistory: formattedHistory,
          tools_used:
            result.intermediateSteps?.map((step) => step.action?.tool) || [],
        },
        userId,
        suggestedQueries,
      );
    } catch (error) {
      return ResponseFormatter.formatChatResponse(
        `I encountered an error while processing your request: ${error.message}. Please try rephrasing your question or provide more specific details.`,
        { error: error.message },
        userId,
      );
    }
  }

  async executeDirectQuery(
    request: string,
    userId: string,
  ): Promise<QueryExecutionResult> {
    const startTime = Date.now();

    try {
      const schema = await this.getSchemaContext(userId);

      // Use direct SQL generation for more reliable results
      const sql = await this.generateSQL(request, schema);
      const explanation = await this.generateExplanation(request, sql, schema);

      let queryResult = await this.executeQuery(sql, userId);
      let finalSQL = sql;
      let finalExplanation = explanation;

      // If query fails, try to fix it
      if (!queryResult.success && queryResult.error) {
        try {
          const correctedSQL = await this.runFailedQuery(
            sql,
            schema,
            queryResult.error,
            request,
          );
          finalSQL = correctedSQL;
          finalExplanation = await this.generateExplanation(
            request,
            correctedSQL,
            schema,
          );
          queryResult = await this.executeQuery(correctedSQL, userId);
        } catch (retryError) {
          // Keep original error if correction fails
        }
      }

      try {
        await this.saveToMemory(
          request,
          `SQL: ${finalSQL}\nExplanation: ${finalExplanation}`,
        );
      } catch (error) {
        console.warn('Memory save failed:', error.message);
      }

      return ResponseFormatter.formatQueryExecution(
        request,
        finalSQL,
        finalExplanation,
        queryResult,
        schema,
        startTime,
      );
    } catch (error) {
      return ResponseFormatter.formatQueryExecution(
        request,
        "",
        `Failed to process query: ${error.message}`,
        { success: false, data: null, error: error.message },
        [],
        startTime,
      );
    }
  }

  private formatChatHistory(chatHistory?: any[]): Array<any> {
    if (!chatHistory || chatHistory.length === 0) {
      return [];
    }

    return chatHistory.slice(-10).map((item) => {
      if (item.type === "human" || item.role === "user") {
        return ["human", item.content || item.message];
      } else if (item.type === "ai" || item.role === "assistant") {
        return ["assistant", item.content || item.message];
      }
      return ["human", String(item)];
    });
  }

  private generateSmartSuggestions(
    userMessage: string,
    agentResponse: string,
    schema: any[],
  ): string[] {
    const suggestions: string[] = [];
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = agentResponse.toLowerCase();

    // Context-aware suggestions based on user intent
    if (
      lowerMessage.includes("show") ||
      lowerMessage.includes("list") ||
      lowerMessage.includes("get")
    ) {
      suggestions.push("Count total records in this table");
      suggestions.push("Show unique values in key columns");
    }

    if (lowerMessage.includes("count") || lowerMessage.includes("how many")) {
      suggestions.push("Break down counts by category");
      suggestions.push("Show distribution across time periods");
    }

    if (
      lowerMessage.includes("recent") ||
      lowerMessage.includes("latest") ||
      lowerMessage.includes("new")
    ) {
      suggestions.push("Show oldest records for comparison");
      suggestions.push("Analyze trends over time");
    }

    if (schema.length > 1) {
      suggestions.push("Find relationships between tables");
      suggestions.push("Compare data across tables");
    }

    if (lowerResponse.includes("error") || lowerResponse.includes("failed")) {
      suggestions.push("Show database schema");
      suggestions.push("List available tables");
    }

    // Schema-based suggestions
    if (schema.length > 0) {
      const firstTable = schema[0];
      if (!suggestions.some((s) => s.includes(firstTable.table_name))) {
        suggestions.push(`Explore ${firstTable.table_name} table structure`);
      }
    }

    // Default helpful suggestions
    if (suggestions.length < 3) {
      suggestions.push(
        "What tables are available?",
        "Show database schema",
        "Help me write a query",
      );
    }

    return suggestions.slice(0, 4);
  }

  async clearUserSession(userId: string): Promise<void> {
    this.agentExecutors.delete(userId);
    this.clearMemory();
  }

  async getSessionInfo(userId: string): Promise<any> {
    const memoryVariables = await this.getMemoryVariables();
    const hasActiveSession = this.agentExecutors.has(userId);

    return {
      hasActiveSession,
      memorySize: memoryVariables.chat_history?.length || 0,
      lastActivity: Date.now(),
    };
  }
}
