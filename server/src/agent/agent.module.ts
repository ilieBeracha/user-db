import { Module } from "@nestjs/common";
import { AgentsController } from "./agent.controller";
import { UserDbModule } from "src/user-db/user-db.module";
import { BaseAgentService } from "./base-agent.service";
import { QueryGeneratorService } from "./query-generator.service";
import { ChatAgentService } from "./chat-agent.service";

@Module({
  controllers: [AgentsController],
  providers: [
    BaseAgentService,
    QueryGeneratorService,
    ChatAgentService
  ],
  imports: [UserDbModule],
})
export class AgentModule {}
