import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { CreateUserDbDto } from "./dto/create-user-db.dto";
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("user-db")
export class UserDbController {
  constructor(private readonly dbService: UserDbService) {}

  @Post("connect")
  @ApiOperation({ summary: "Connect to user database" })
  @ApiBody({ type: CreateUserDbDto })
  @ApiResponse({ status: 200, description: "Connected to user database" })
  async connect(@Body() dto: CreateUserDbDto) {
    const ds = await this.dbService.connectToUserDb(dto);

    return {
      connected: true,
      host: ds.host,
      database: ds.database,
      port: ds.port,
      user: ds.user,
      ssl: ds.ssl,
    };
  }

  @Get("get-tables")
  @ApiOperation({ summary: "Get all tables from user database" })
  @ApiResponse({ status: 200, description: "All tables from user database" })
  async getTables(@Body() dto: CreateUserDbDto) {
    const tables = await this.dbService.getTables(dto);
    return tables;
  }
}
