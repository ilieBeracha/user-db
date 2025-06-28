import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { QueryGeneratorService } from "./query-generator.service";
import { ChatAgentService } from "./chat-agent.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("agent")
export class AgentsController {
  constructor(
    private queryGenerator: QueryGeneratorService,
    private chatAgent: ChatAgentService
  ) {}

  @Post("generate")
  @UseGuards(JwtAuthGuard)
  async generateQuery(@Body() body: { requirement: string }, @Req() req: any) {
    return await this.queryGenerator.generateAndExecuteQuery(
      body.requirement,
      req.user.id
    );
  }

  @Post("chat")
  @UseGuards(JwtAuthGuard)
  async chatWithDatabase(
    @Body() body: { message: string; chatHistory?: any[] },
    @Req() req: any
  ) {
    return await this.chatAgent.chatAboutDatabase(
      body.message,
      req.user.id,
      body.chatHistory
    );
  }
}
