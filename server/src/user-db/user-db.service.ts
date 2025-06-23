import { Injectable } from "@nestjs/common";
import { CreateUserDbDto } from "./dto/create-user-db.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDb } from "./entities/user-db.entity";
import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";

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

  private async getUserDbConnection(user_id: string) {
    const userDb = await this.getUserDb(user_id);
    await this.initializeConnection(userDb as CreateUserDbDto);
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

  async connectToUserDb(dto: CreateUserDbDto) {
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
  }

  async getAllDatabasesInServer(user_id: string) {
    await this.getUserDbConnection(user_id);

    const databases = await this.connection
      .createQueryRunner()
      .query(`SELECT datname FROM pg_database`);

    return databases;
  }

  async getDatabasesInServer(user_id: string) {
    await this.getUserDbConnection(user_id);

    const databases = await this.connection
      .createQueryRunner()
      .query(`SELECT datname FROM pg_database`);

    return databases;
  }

  async getTables(user_id: string) {
    await this.getUserDbConnection(user_id);

    const tables = await this.connection
      .createQueryRunner()
      .query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = $1`,
        ["public"]
      );

    return tables;
  }
}
