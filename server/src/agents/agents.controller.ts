import { Controller, Get, Post, Query } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { Body } from "@nestjs/common";

@Controller("agent")
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post("chat")
  async executeDirectQuery(
    @Body("query") query: string,
    @Body("userId") userId: string
  ) {
    const result = await this.agentsService.executeDirectQuery(query, userId);
    return result;
  }
}
