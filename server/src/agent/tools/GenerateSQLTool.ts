import { Tool } from "@langchain/core/tools";
import { BaseAgentService } from "../base-agent.service";

export class GenerateSQLTool extends Tool {
  name = "generate_sql";
  description =
    "Generate a SQL query from a natural language request using the database schema. Use this tool when users ask questions about their data or want to query the database.";

  constructor(
    private readonly baseAgent: BaseAgentService,
    private readonly userId: string,
  ) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      const schema = await this.baseAgent.getSchemaContext(this.userId);
      const sql = await this.baseAgent.generateSQL(input, schema);

      const queryResult = await this.baseAgent.executeQuery(sql, this.userId);

      if (queryResult.success) {
        const explanation = await this.baseAgent.generateExplanation(
          input,
          sql,
          schema,
        );
        return `Generated SQL: ${sql}\n\nExplanation: ${explanation}\n\nQuery executed successfully with ${queryResult.data?.length || 0} results.`;
      } else {
        const correctedSQL = await this.baseAgent.runFailedQuery(
          sql,
          schema,
          queryResult.error,
          input,
        );
        const retryResult = await this.baseAgent.executeQuery(
          correctedSQL,
          this.userId,
        );

        if (retryResult.success) {
          const explanation = await this.baseAgent.generateExplanation(
            input,
            correctedSQL,
            schema,
          );
          return `Corrected SQL: ${correctedSQL}\n\nExplanation: ${explanation}\n\nQuery executed successfully with ${retryResult.data?.length || 0} results.`;
        } else {
          return `Failed to generate working SQL. Error: ${retryResult.error}`;
        }
      }
    } catch (error) {
      return `Error generating SQL: ${error.message}`;
    }
  }
}
