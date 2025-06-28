import { Tool } from "@langchain/core/tools";
import { BaseAgentService } from "../base-agent.service";

export class ExecuteQueryTool extends Tool {
  name = "execute_sql_query";
  description =
    "Execute a SQL query on the database and return the results. Use this tool when you have a specific SQL query to run.";

  constructor(
    private readonly baseAgent: BaseAgentService,
    private readonly userId: string,
  ) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const cleanSQL = this.baseAgent.cleanGeneratedSQL(input);

      // Add LIMIT if not present and it's a SELECT statement
      let sql = cleanSQL;
      if (
        cleanSQL.toLowerCase().startsWith("select") &&
        !cleanSQL.toLowerCase().includes("limit")
      ) {
        sql = `${cleanSQL} LIMIT 100`;
      }

      const result = await this.baseAgent.executeQuery(sql, this.userId);

      if (result.success) {
        const data = result.data || [];
        if (data.length === 0) {
          return "Query executed successfully but returned no results.";
        }

        const rowCount = data.length;
        const columns = data.length > 0 ? Object.keys(data[0]) : [];

        // Format first few rows for display
        const preview = data
          .slice(0, 5)
          .map((row) => columns.map((col) => `${col}: ${row[col]}`).join(", "))
          .join("\n");

        return `Query executed successfully!\n\nColumns: ${columns.join(", ")}\nRows returned: ${rowCount}\n\nPreview (first 5 rows):\n${preview}${rowCount > 5 ? "\n...(more rows available)" : ""}`;
      } else {
        return `Query failed with error: ${result.error}`;
      }
    } catch (error) {
      return `Error executing query: ${error.message}`;
    }
  }
}
