import { Module } from "@nestjs/common";
import { AgentsController } from "./agent.controller";
import { UserDbModule } from "src/user-db/user-db.module";
import { BaseAgentService } from "./base-agent.service";
import { UnifiedAgentService } from "./unified-agent.service";

@Module({
  controllers: [AgentsController],
  providers: [
    BaseAgentService,
    UnifiedAgentService,
  ],
  imports: [UserDbModule],
  exports: [UnifiedAgentService],
})
export class AgentModule {}
