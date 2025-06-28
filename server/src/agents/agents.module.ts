import { Module } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { AgentsController } from "./agents.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
