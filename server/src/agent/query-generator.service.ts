import { Injectable } from "@nestjs/common";
import { BaseAgentService } from "./base-agent.service";
import {
  ResponseFormatter,
  QueryExecutionResult,
} from "./formatters/response.formatter";

@Injectable()
export class QueryGeneratorService extends BaseAgentService {
  async generateAndExecuteQuery(
    request: string,
    userId: string
  ): Promise<QueryExecutionResult> {
    const startTime = Date.now();

    try {
      const schema = await this.getSchemaContext(userId);

      const prompt = this.buildBasePrompt(request, schema);

      const response = await this.llm.invoke(prompt);
      const rawSQL = response.content.toString();
      const cleanSQL = this.cleanGeneratedSQL(rawSQL);

      const explanation = await this.generateExplanation(
        request,
        cleanSQL,
        schema
      );

      let queryResult = await this.executeQuery(cleanSQL, userId);
      let finalSQL = cleanSQL;
      let finalExplanation = explanation;

      if (!queryResult.success && queryResult.error) {
        try {
          const correctedSQL = await this.runFailedQuery(
            cleanSQL,
            schema,
            queryResult.error,
            request
          );
          finalSQL = correctedSQL;
          finalExplanation = await this.generateExplanation(
            request,
            correctedSQL,
            schema
          );
          queryResult = await this.executeQuery(correctedSQL, userId);
        } catch (retryError) {}
      }

      // 7. Format and return response
      return ResponseFormatter.formatQueryExecution(
        request,
        finalSQL,
        finalExplanation,
        queryResult,
        schema,
        startTime
      );
    } catch (error) {
      return ResponseFormatter.formatQueryExecution(
        request,
        "",
        "Failed to generate explanation due to error",
        { success: false, data: null, error: error.message },
        [],
        startTime
      );
    }
  }
}
