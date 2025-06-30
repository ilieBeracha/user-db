import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("user-db")
export class UserDbController {
  constructor(private readonly userDbService: UserDbService) {}

  @Get("connection")
  @UseGuards(JwtAuthGuard)
  async getConnection(@Req() req: any): Promise<any> {
    return this.userDbService.isConnected(req);
  }

  @Post("connect")
  @UseGuards(JwtAuthGuard)
  async connect(@Req() req: any): Promise<any> {
    return this.userDbService.connect(req.body, req.user.id);
  }

  @Get("schema-explorer")
  @UseGuards(JwtAuthGuard)
  async getTables(@Req() req: any): Promise<any> {
    return this.userDbService.getSchemaExplorerAcrossDatabases(req?.user?.id);
  }

  @Get("activities")
  @UseGuards(JwtAuthGuard)
  async getRecentActivities(@Req() req: any): Promise<any> {
    console.log(req?.user?.id);
    return this.userDbService.getRecentActivities(req?.user?.id);
  }

  @Post("execute-ai-query")
  @UseGuards(JwtAuthGuard)
  async executeAiQuery(@Body() body: any, @Req() req: any): Promise<any> {
    console.log(body.query);
    return this.userDbService.executeAiQuery(body.query, req?.user?.id);
  }

  @Post("send-ai-chat")
  @UseGuards(JwtAuthGuard)
  async sendAiChat(@Body() body: any, @Req() req: any): Promise<any> {
    console.log("Body:", body);
    return this.userDbService.sendAiChat(body.query, req?.user?.id);
  }
}
