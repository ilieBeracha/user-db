import { Module } from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { UserDbController } from "./user-db.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDb } from "./entities/user-db.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserDb])],
  controllers: [UserDbController],
  providers: [UserDbService],
})
export class UserDbModule {}
