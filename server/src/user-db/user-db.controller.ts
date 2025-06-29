import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
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
  async executeQuery(@Req() req: any): Promise<any> {
    return this.userDbService.connect(req.body, req.user.id);
  }

  @Get("schema-explorer")
  @UseGuards(JwtAuthGuard)
  async getTables(@Req() req: any): Promise<any> {
    return this.userDbService.getSchemaExplorerAcrossDatabases(req?.user?.id);
  }
}
