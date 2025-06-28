import { Module } from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { UserDbController } from "./user-db.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDb } from "./entities/user-db.entity";
import { UserDbConnectionManager } from "./user-db-connection.manager";

@Module({
  imports: [TypeOrmModule.forFeature([UserDb])],
  controllers: [UserDbController],
  providers: [UserDbService, UserDbConnectionManager],
  exports: [UserDbService],
})
export class UserDbModule {}
