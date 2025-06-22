import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { CreateUserDbDto } from "./dto/create-user-db.dto";
import { ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("user-db")
export class UserDbController {
  constructor(private readonly dbService: UserDbService) {}

  @Post("connect")
  @ApiOperation({ summary: "Connect to user database" })
  @ApiBody({ type: CreateUserDbDto })
  @ApiResponse({ status: 200, description: "Connected to user database" })
  @UseGuards(JwtAuthGuard)
  async connect(@Body() dto: CreateUserDbDto, @Req() req: any) {
    const user = req?.user as User;
    const ds = await this.dbService.connectToUserDb(dto);

    return {
      connected: true,
      host: ds.host,
      database: ds.database,
      port: ds.port,
      user: ds.user,
      ssl: ds.ssl,
      user_id: user.id,
    };
  }

  @Get("get-tables")
  @ApiOperation({ summary: "Get all tables from user database" })
  @ApiResponse({ status: 200, description: "All tables from user database" })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getTables(@Body() dto: CreateUserDbDto, @Req() req: any) {
    const user = req?.user as User;
    const tables = await this.dbService.getTables(dto);

    return {
      tables: tables,
      count: tables.length,
    };
  }

  @Get("get-all-databases")
  @ApiOperation({ summary: "Get all databases from user database" })
  @ApiResponse({ status: 200, description: "All databases from user database" })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllDatabases(@Body() dto: CreateUserDbDto) {
    const databases = await this.dbService.getAllDatabasesInServer(dto);

    return {
      databases: databases,
      count: databases.length,
    };
  }
}
