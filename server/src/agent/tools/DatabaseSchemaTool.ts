import { Tool } from "@langchain/core/tools";
import { BaseAgentService } from "../base-agent.service";

export class DatabaseSchemaTool extends Tool {
  name = "get_database_schema";
  description =
    "Get information about the database schema including tables, columns, and relationships. Use this tool when users ask about database structure or available tables.";

  constructor(
    private readonly baseAgent: BaseAgentService,
    private readonly userId: string,
  ) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const schema = await this.baseAgent.getSchemaContext(this.userId);

      if (!schema || schema.length === 0) {
        return "No tables found in the database or no database connection available.";
      }

      const inputLower = input.toLowerCase();

      if (inputLower.includes("detailed") || inputLower.includes("full")) {
        return `Database Schema (Detailed):\n${JSON.stringify(schema, null, 2)}`;
      } else if (inputLower.includes("tables") && inputLower.includes("only")) {
        const tableNames = schema.map((table) => table.table_name).join(", ");
        return `Available tables: ${tableNames}`;
      } else {
        const summary = schema
          .map((table) => {
            const columnCount = table.columns?.length || 0;
            const primaryKeys =
              table.columns?.filter((col) => col.is_primary_key).length || 0;
            return `• ${table.table_name}: ${columnCount} columns${primaryKeys ? `, ${primaryKeys} primary key(s)` : ""}`;
          })
          .join("\n");

        return `Database Schema Summary:\n${summary}\n\nTotal tables: ${schema.length}`;
      }
    } catch (error) {
      return `Error retrieving database schema: ${error.message}`;
    }
  }
}
