import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDb } from "./entities/user-db.entity";
import { UserDbConnectionManager } from "./user-db-connection.manager";
import {
  CONNECTION_USAGE_BY_DB_QUERY,
  EFFICIENCY_COMPARISON_QUERY,
  GET_RECENT_ACTIVITY_QUERY,
  LARGEST_DATABASE_QUERY,
  RESOURCE_UTILIZATION_SUMMARY_QUERY,
  PERFORMANCE_MATRIX,
} from "./queries/queries";

@Injectable()
export class UserDbService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userDbRepo: Repository<UserDb>,
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
      [50],
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
}
