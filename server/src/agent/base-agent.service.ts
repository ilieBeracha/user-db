import { Injectable } from "@nestjs/common";
import { ChatOpenAI } from "@langchain/openai";
import { UserDbService } from "src/user-db/user-db.service";
import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

@Injectable()
export class BaseAgentService {
  protected llm: ChatOpenAI;
  protected memory: BufferMemory;

  constructor(protected userDbService: UserDbService) {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
      maxTokens: 4000,
    });

    this.memory = new BufferMemory({
      memoryKey: "chat_history",
      chatHistory: new ChatMessageHistory(),
      returnMessages: true,
    });
  }

  async getSchemaContext(userId: string): Promise<any[]> {
    try {
      const schema = await this.userDbService.getTablesWithColumns(userId);
      return schema || [];
    } catch (error) {
      console.error("Failed to get schema context:", error);
      return [];
    }
  }

  async generateSQL(request: string, schema: any[]): Promise<string> {
    const schemaContext = this.formatSchemaForPrompt(schema);
    
    const prompt = `Given the following database schema and user request, generate a PostgreSQL query.

Database Schema:
${schemaContext}

User Request: ${request}

Rules:
- Return only the SQL query, no explanations
- Use proper PostgreSQL syntax
- Include table aliases when joining tables
- Use LIMIT for large result sets when appropriate

SQL Query:`;

    const response = await this.llm.invoke(prompt);
    return response.content.toString().trim().replace(/```sql|```/g, "").trim();
  }

  async generateExplanation(request: string, sql: string, schema: any[]): Promise<string> {
    const prompt = `Explain this SQL query in simple terms:

User Request: ${request}
SQL Query: ${sql}

Provide a clear, non-technical explanation of what this query does and what results it will return.`;

    const response = await this.llm.invoke(prompt);
    return response.content.toString().trim();
  }

  async executeQuery(sql: string, userId: string): Promise<any> {
    try {
      const result = await this.userDbService.executeCustomQuery(sql, userId);
      return {
        success: true,
        data: result,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  async runFailedQuery(sql: string, schema: any[], error: string, originalRequest: string): Promise<string> {
    const schemaContext = this.formatSchemaForPrompt(schema);
    
    const prompt = `The following SQL query failed with an error. Please fix it:

Original Request: ${originalRequest}
Failed SQL: ${sql}
Error: ${error}

Database Schema:
${schemaContext}

Return only the corrected SQL query:`;

    const response = await this.llm.invoke(prompt);
    return response.content.toString().trim().replace(/```sql|```/g, "").trim();
  }

  async saveToMemory(input: string, output: string): Promise<void> {
    try {
      await this.memory.saveContext({ input }, { output });
    } catch (error) {
      console.warn("Failed to save to memory:", error);
    }
  }

  clearMemory(): void {
    this.memory.clear();
  }

  async getMemoryVariables(): Promise<any> {
    return await this.memory.loadMemoryVariables({});
  }

  cleanGeneratedSQL(sql: string): string {
    return sql
      .replace(/```sql|```/g, "")
      .replace(/^sql\s*/i, "")
      .trim();
  }

  private formatSchemaForPrompt(schema: any[]): string {
    if (!schema || schema.length === 0) {
      return "No schema information available.";
    }

    return schema
      .map((table) => {
        const columns = table.columns || [];
        const columnList = columns
          .map((col: any) => `  ${col.column_name} (${col.data_type})`)
          .join("\n");
        return `Table: ${table.table_name}\n${columnList}`;
      })
      .join("\n\n");
  }
}