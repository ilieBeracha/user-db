import { Controller, Get, Req, UseGuards } from "@nestjs/common";
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

  @Get("activities")
  @UseGuards(JwtAuthGuard)
  async getRecentActivity(@Req() req: any): Promise<any> {
    return this.userDbService.getRecentActivity(req);
  }

  @Get("comparison")
  @UseGuards(JwtAuthGuard)
  async getComparisonData(@Req() req: any): Promise<any> {
    return this.userDbService.getComparisonData(req);
  }

  @Get("server-databases")
  @UseGuards(JwtAuthGuard)
  async getDatabasesInServer(@Req() req: any): Promise<any> {
    return this.userDbService.getDatabasesInServer(req);
  }

  @Get("schema-explorer")
  @UseGuards(JwtAuthGuard)
  async getTables(@Req() req: any): Promise<any> {
    return this.userDbService.getSchemaExplorerAcrossDatabases(req?.user?.id);
  }
}
