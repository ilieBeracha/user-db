import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { AppDataSource } from "src/data-source";
import { UserDb } from "./entities/user-db.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserDbConnectionManager {
  private dataSources: Map<string, DataSource> = new Map();
  private readonly logger = new Logger(UserDbConnectionManager.name);
  constructor(
    @InjectRepository(UserDb)
    private readonly userDbRepo: Repository<UserDb>
  ) {}
  async getDataSource(userDb: UserDb): Promise<DataSource> {
    const cacheKey = `${userDb.user_id}`;

    if (this.dataSources.has(cacheKey)) {
      const existing = this.dataSources.get(cacheKey)!;
      if (existing.isInitialized) return existing;
    }

    const newDataSource = AppDataSource(
      userDb.host,
      userDb.port,
      userDb.user,
      userDb.password,
      userDb.database
    );

    await newDataSource.initialize();
    this.dataSources.set(cacheKey, newDataSource);
    return newDataSource;
  }

  async getConnectionForDatabase(
    database: string,
    userId: string
  ): Promise<DataSource> {
    const baseUserDb = await this.userDbRepo.findOneBy({ user_id: userId });
    if (!baseUserDb) throw new Error("User DB not found");

    const cacheKey = `${userId}::${database}`;
    if (this.dataSources.has(cacheKey)) {
      const existing = this.dataSources.get(cacheKey)!;
      if (existing.isInitialized) return existing;
    }

    const newDataSource = AppDataSource(
      baseUserDb.host,
      baseUserDb.port,
      baseUserDb.user,
      baseUserDb.password,
      database
    );

    await newDataSource.initialize();
    this.dataSources.set(cacheKey, newDataSource);
    return newDataSource;
  }

  async closeAll() {
    for (const [_, ds] of this.dataSources) {
      if (ds.isInitialized) await ds.destroy();
    }
    this.dataSources.clear();
  }

  async performBatch(batches: any, user_id: string) {
    const userDb = await this.userDbRepo.findOneBy({ user_id });
    if (!userDb) throw new Error("User DB not found");

    const dataSource = await this.getDataSource(userDb);

    const results: any = {};

    for (const batch of batches) {
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      try {
        const result = await queryRunner.query(batch.query, batch.parameters);
        results[batch.response] = result;
      } catch (e) {
        console.error(`${batch.response}: ${e.message}`);
        throw e;
      } finally {
        await queryRunner.release();
      }
    }

    return results;
  }

  async runSingleQuery(query: string, params: any[], user_id: string) {
    const userDb = await this.userDbRepo.findOneBy({ user_id });
    if (!userDb) throw new Error("User DB not found");
    const dataSource = await this.getDataSource(userDb);
    return await dataSource.query(query, params);
  }

  async isConnected(req: any) {
    const userDb = await this.userDbRepo.findOneBy({ user_id: req?.user?.id });
    if (!userDb) throw new Error("User DB not found");
    const dataSource = await this.getDataSource(userDb);
    return dataSource.isInitialized;
  }
}
