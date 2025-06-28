import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Get,
} from "@nestjs/common";
import { UnifiedAgentService } from "./unified-agent.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("agent")
export class AgentsController {
  constructor(
    private unifiedAgent: UnifiedAgentService,
  ) {}

  @Post("generate")
  @UseGuards(JwtAuthGuard)
  async generateQuery(@Body() body: { requirement: string }, @Req() req: any) {
    return await this.unifiedAgent.executeDirectQuery(
      body.requirement,
      req.user.id,
    );
  }

  @Post("chat")
  @UseGuards(JwtAuthGuard)
  async chatWithDatabase(
    @Body() body: { message: string; chatHistory?: any[] },
    @Req() req: any,
  ) {
    return await this.unifiedAgent.processMessage(
      body.message,
      req.user.id,
      body.chatHistory,
    );
  }

  @Delete("session")
  @UseGuards(JwtAuthGuard)
  async clearSession(@Req() req: any) {
    await this.unifiedAgent.clearUserSession(req.user.id);
    return { success: true, message: "Session cleared successfully" };
  }

  @Get("session")
  @UseGuards(JwtAuthGuard)
  async getSessionInfo(@Req() req: any) {
    return await this.unifiedAgent.getSessionInfo(req.user.id);
  }
}
