import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDb } from "./entities/user-db.entity";
import { UserDbConnectionManager } from "./user-db-connection.manager";
import { LARGEST_DATABASE_QUERY } from "./queries/queries";

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

  async isConnected(req: any) {
    const result = await this.connManager.isConnected(req);
    return result;
  }
}
