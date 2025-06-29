import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDb } from "./entities/user-db.entity";
import { UserDbConnectionManager } from "./user-db-connection.manager";
import {
  GET_RECENT_ACTIVITY_QUERY,
  LARGEST_DATABASE_QUERY,
  RESOURCE_UTILIZATION_SUMMARY_QUERY,
  GET_TABLES_WITH_COLUMNS_QUERY,
} from "./queries/queries";

@Injectable()
export class UserDbService {
  private SENSITIVE_KEYS = [
    "password",
    "secret",
    "token",
    "api_key",
    "key",
    "access_token",
    "private",
  ];

  constructor(
    @InjectRepository(UserDb)
    private readonly userDbRepository: Repository<UserDb>,
    private readonly connManager: UserDbConnectionManager
  ) {}

  async getDatabasesInServer(req: any) {
    const result = await this.connManager.runSingleQuery(
      LARGEST_DATABASE_QUERY,
      [100],
      req?.user?.id
    );

    return result;
  }

  async getRecentActivity(req: any, limit: number = 10) {
    const result = await this.connManager.runSingleQuery(
      GET_RECENT_ACTIVITY_QUERY,
      [100],
      req?.user?.id
    );

    return result;
  }

  async getComparisonData(req: any) {
    const results = await this.connManager.runSingleQuery(
      RESOURCE_UTILIZATION_SUMMARY_QUERY,
      [],
      req?.user?.id
    );

    return results;
  }

  async isConnected(req: any) {
    const result = await this.connManager.isConnected(req);
    return result;
  }

  async getTablesWithColumns(user_id: string) {
    const result = await this.connManager.runSingleQuery(
      GET_TABLES_WITH_COLUMNS_QUERY,
      [],
      user_id
    );
    return result;
  }

  async executeCustomQuery(query: string, user_id: string) {
    // Security: Basic validation to prevent dangerous operations
    const cleanQuery = query.toLowerCase().trim();
    const dangerousOperations = [
      "drop",
      "delete",
      "truncate",
      "alter",
      "update",
      "insert",
      "create",
    ];
    console.log(cleanQuery);
    console.log(dangerousOperations);
    for (const operation of dangerousOperations) {
      if (cleanQuery.includes(operation)) {
        throw new Error(`Dangerous operation '${operation}' not allowed`);
      }
    }

    return await this.connManager.runSingleQuery(query, [], user_id);
  }

  async getSchemaExplorerAcrossDatabases(userId: string): Promise<any> {
    const fullResult: any[] = [];

    // 1. Fetch all non-template DBs
    const databases: { datname: string }[] =
      await this.connManager.runSingleQuery(
        `SELECT datname FROM pg_database WHERE datistemplate = false`,
        [],
        userId
      );

    for (const db of databases) {
      const dbName = db.datname;

      try {
        // ✅ FIXED: Get a real connection object for this DB
        await this.connManager.getConnectionForDatabase(dbName, userId);

        // 2. Get all tables + columns for that DB
        const tables: {
          table_name: string;
          column_count: number;
          columns: { column: string; type: string; nullable: string }[];
        }[] = await this.connManager.runSingleQuery(
          GET_TABLES_WITH_COLUMNS_QUERY,
          [],
          userId
        );

        // 3. For each table, get 1 sample row
        for (const table of tables) {
          const safeTable = `"public"."${table.table_name}"`;
          let sampleRow: Record<string, any> = {};

          try {
            const result = await this.connManager.runSingleQuery(
              `SELECT * FROM ${safeTable} LIMIT 1`,
              [],
              userId
            );
            sampleRow = result?.[0] || {};
          } catch {
            sampleRow = {};
          }

          // 4. Attach sample values with classification
          table.columns = table.columns.map((col) => {
            const isSensitive = this.SENSITIVE_KEYS.some((keyword) =>
              col.column.toLowerCase().includes(keyword)
            );

            return {
              ...col,
              sample: isSensitive
                ? "[CLASSIFIED]"
                : (sampleRow[col.column] ?? null),
            };
          });
        }

        fullResult.push({
          database: dbName,
          tables,
        });
      } catch (err) {
        fullResult.push({
          database: dbName,
          error: "Failed to connect or retrieve data",
        });
      }
    }

    return { results: fullResult, query: GET_TABLES_WITH_COLUMNS_QUERY };
  }
}
