import { Injectable } from "@nestjs/common";
import { ChatOpenAI } from "@langchain/openai";
import { UserDbService } from "src/user-db/user-db.service";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

@Injectable()
export class BaseAgentService {
  protected llm: ChatOpenAI;

  constructor(protected userDbService: UserDbService) {
    this.llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: configService.get("OPENAI_API_KEY"),
    });
  }

  async getSchemaContext(userId: string) {
    return await this.userDbService.getTablesWithColumns(userId);
  }

  async executeQuery(sql: string, userId: string) {
    try {
      const result = await this.userDbService.executeCustomQuery(sql, userId);
      return { success: true, data: result, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  }

  cleanGeneratedSQL(rawSQL: string): string {
    let cleanSQL = rawSQL.trim();
    cleanSQL = cleanSQL.replace(/```sql\n?/g, "").replace(/```\n?/g, "");
    cleanSQL = cleanSQL.replace(/^SQL QUERY:\s*/i, "");

    cleanSQL = cleanSQL.replace(/\bcolumn\b(?!")/gi, '"column_name"');
    cleanSQL = cleanSQL.replace(/\btable\b(?!")/gi, '"table_name"');

    return cleanSQL.trim();
  }

  buildBasePrompt(request: string, schema: any[]): string {
    return `Generate a SQL query based on the following request.

REQUEST: ${request}

AVAILABLE SCHEMA:
${JSON.stringify(schema, null, 2)}

CRITICAL INSTRUCTIONS:
- Generate ONLY the SQL query, no explanations or markdown
- ALWAYS use double quotes around table names, column names when needed
- When joining different data types, use proper casting (::text, ::uuid)
- Use DISTINCT if duplicates are expected
- Use proper PostgreSQL syntax
- Only use SELECT statements
- IMPORTANT: Only query user-created tables, exclude system tables
- For record counts, use UNION ALL to count rows from each table
- Example record count: SELECT SUM(cnt) as total_records FROM ((SELECT COUNT(*) as cnt FROM "user") UNION ALL (SELECT COUNT(*) as cnt FROM "user_db")) as counts

SQL QUERY:`;
  }

  async generateExplanation(
    request: string,
    generatedSQL: string,
    schema: any[]
  ): Promise<string> {
    const explanationPrompt = `Explain what this SQL query does and why it was generated.

ORIGINAL REQUEST: ${request}

GENERATED SQL:
${generatedSQL}

DATABASE SCHEMA:
${JSON.stringify(schema, null, 2)}

INSTRUCTIONS:
- Explain in simple, clear language what the query does
- Mention which tables/columns were used and why
- Explain any JOINs, filters, or aggregations
- Keep it concise (2-3 sentences)
- Start with "This query..."

EXPLANATION:`;

    const response = await this.llm.invoke(explanationPrompt);
    return response.content.toString().trim();
  }

  async runFailedQuery(
    originalQuery: string,
    schema: any[],
    error: string,
    request: string
  ): Promise<string> {
    const retryPrompt = `The previous SQL query failed. Please generate a corrected version.

ORIGINAL REQUEST: ${request}

FAILED QUERY:
${originalQuery}

ERROR MESSAGE:
${error}

DATABASE SCHEMA:
${JSON.stringify(schema, null, 2)}

INSTRUCTIONS:
- Analyze the error and fix the SQL syntax
- Generate ONLY the corrected SQL query, no explanations
- Use proper PostgreSQL syntax
- Ensure table and column names are correctly quoted
- Only use SELECT statements

CORRECTED SQL QUERY:`;

    const response = await this.llm.invoke(retryPrompt);
    return this.cleanGeneratedSQL(response.content.toString());
  }
}
