import { Module } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { AgentsController } from "./agents.controller";
import { UserDbModule } from "src/user-db/user-db.module";

@Module({
  controllers: [AgentsController],
  imports: [UserDbModule],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
