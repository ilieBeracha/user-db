import { Injectable } from "@nestjs/common";
import { CreateUserDbDto } from "./dto/create-user-db.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDb } from "./entities/user-db.entity";
import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { GET_ALL_DATABASES_IN_SERVER_QUERY } from "./queries/server-level";
import { GET_TABLES_QUERY } from "./queries/tables-level";
import { GET_COLUMNS_QUERY } from "./queries/tables-level";
import { KILL_STALE_CONNECTIONS_QUERY } from "./queries/tables-level";
import { withDbRescue } from "../../common/utils/with-db-rescue";

@Injectable()
export class UserDbService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userDbRepo: Repository<UserDb>
  ) {}

  private connection: DataSource;

  async getUserDb(user_id: string) {
    const userDb = await this.userDbRepo.findOne({ where: { user_id } });
    return userDb;
  }

  private async getUserDbConnection(user_id: string, overrideDb?: string) {
    const userDb = await this.getUserDb(user_id);
    const dbConfig = { ...userDb } as CreateUserDbDto;

    if (overrideDb) {
      dbConfig.database = overrideDb; // force the database override
    }

    await this.initializeConnection(dbConfig);
    return this.connection;
  }

  async initializeConnection(dto: CreateUserDbDto) {
    this.connection = new DataSource({
      type: "postgres",
      host: dto.host,
      port: dto.port,
      username: dto.user,
      password: dto.password,
      database: dto.database,
      ssl: dto.ssl ? { rejectUnauthorized: false } : false,
    });
    await this.connection.initialize();
  }

  async connectToUserDb(dto: CreateUserDbDto, user_id: string) {
    return withDbRescue(
      user_id,
      async () => {
        const testConnection = new DataSource({
          type: "postgres",
          host: dto.host,
          port: dto.port,
          username: dto.user,
          password: dto.password,
          database: dto.database,
          ssl: dto.ssl ? { rejectUnauthorized: false } : false,
        });

        try {
          await testConnection.initialize();
        } catch (err) {
          throw new Error("Failed to connect to user DB: " + err.message);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const saved = this.userDbRepo.create({
          host: dto.host,
          port: dto.port,
          user: dto.user,
          password: hashedPassword,
          database: dto.database,
          ssl: dto.ssl,
          user_id: user_id,
        });

        const result = await this.userDbRepo.save(saved);

        return {
          id: result.id,
          host: result.host,
          port: result.port,
          user: result.user,
          database: result.database,
          ssl: result.ssl,
        };
      },
      this.killStaleConnections.bind(this)
    );
  }

  async getAllDatabasesInServer(user_id: string) {
    return withDbRescue(
      user_id,
      async () => {
        await this.getUserDbConnection(user_id);

        const databases = await this.connection
          .createQueryRunner()
          .query(GET_ALL_DATABASES_IN_SERVER_QUERY);

        return databases;
      },
      this.killStaleConnections.bind(this)
    );
  }

  async getTablesInDatabase(user_id: string, database: string) {
    return withDbRescue(
      user_id,
      async () => {
        await this.getUserDbConnection(user_id, database);

        const tables: { table_schema: string; table_name: string }[] =
          await this.connection.createQueryRunner().query(GET_TABLES_QUERY);

        const columns: {
          table_schema: string;
          table_name: string;
          column_name: string;
          data_type: string;
        }[] = await this.connection
          .createQueryRunner()
          .query(GET_COLUMNS_QUERY);

        const tableMap = tables.map((table) => {
          const tableCols = columns.filter(
            (col) =>
              col.table_schema === table.table_schema &&
              col.table_name === table.table_name
          );

          return {
            ...table,
            columns: tableCols.map(({ column_name, data_type }) => ({
              name: column_name,
              type: data_type,
            })),
          };
        });

        return tableMap;
      },
      this.killStaleConnections.bind(this)
    );
  }

  async killStaleConnections(user_id: string) {
    const userDb = await this.getUserDb(user_id);
    const dbConfig = { ...userDb } as CreateUserDbDto;

    await this.initializeConnection(dbConfig);

    const staleConnections = await this.connection
      .createQueryRunner()
      .query(KILL_STALE_CONNECTIONS_QUERY);
    console.log(staleConnections);
  }
}
