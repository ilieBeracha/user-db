import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDb } from "./entities/user-db.entity";
import { UserDbConnectionManager } from "./user-db-connection.manager";
import { GET_TABLES_WITH_COLUMNS_QUERY } from "./queries/queries";

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

  async isConnected(req: any) {
    const result = await this.connManager.isConnected(req);
    return result;
  }

  async connect(database: UserDb, userId: string) {
    database.user_id = userId;
    const result = await this.userDbRepository.save(database);
    return result;
  }

  async executeCustomQuery(query: string, user_id: string) {
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

    for (const operation of dangerousOperations) {
      if (cleanQuery.includes(operation)) {
        throw new Error(`Dangerous operation '${operation}' not allowed`);
      }
    }

    return await this.connManager.runSingleQuery(query, [], user_id);
  }

  async getSchemaExplorerAcrossDatabases(userId: string): Promise<any> {
    const fullResult: any[] = [];

    const databases: { datname: string }[] =
      await this.connManager.runSingleQuery(
        `SELECT datname FROM pg_database WHERE datistemplate = false`,
        [],
        userId
      );

    for (const db of databases) {
      const dbName = db.datname;

      try {
        await this.connManager.getConnectionForDatabase(dbName, userId);

        const tables: {
          table_name: string;
          column_count: number;
          columns: { column: string; type: string; nullable: string }[];
        }[] = await this.connManager.runSingleQuery(
          GET_TABLES_WITH_COLUMNS_QUERY,
          [],
          userId
        );

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
