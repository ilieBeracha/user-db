import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { CreateUserDbDto } from "./dto/create-user-db.dto";
import { ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("user-db")
export class UserDbController {
  constructor(private readonly dbService: UserDbService) {}

  @Get("connection")
  @ApiOperation({ summary: "Get user database connection" })
  @ApiResponse({
    status: 200,
    description: "Returns true if connected, false otherwise",
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getConnection(@Req() req: any) {
    const user = req?.user as User;
    const connection = await this.dbService.getUserDb(user.id);
    return connection;
  }

  @Post("connect")
  @ApiOperation({ summary: "Connect to user database" })
  @ApiBody({ type: CreateUserDbDto })
  @ApiResponse({ status: 200, description: "Connected to user database" })
  @UseGuards(JwtAuthGuard)
  async connect(@Body() dto: CreateUserDbDto, @Req() req: any) {
    const user = req?.user as User;
    const ds = await this.dbService.connectToUserDb(dto, user.id);

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

  @Get("tables")
  @ApiOperation({ summary: "Get all tables from user database" })
  @ApiResponse({ status: 200, description: "All tables from user database" })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getTables(@Query() query: any, @Req() req: any) {
    const user = req?.user as User;
    const tables = await this.dbService.getTablesInDatabase(
      user.id,
      query.database as string
    );

    return {
      tables: tables,
      count: tables.length,
    };
  }

  @Get("server-databases")
  @ApiOperation({ summary: "Get all databases from user database" })
  @ApiResponse({ status: 200, description: "All databases from user database" })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllDatabases(@Req() req: any) {
    const user = req?.user as User;
    const databases = await this.dbService.getAllDatabasesInServer(user.id);

    return {
      databases: databases,
      count: databases.length,
    };
  }

  @Post("kill-stale-connections")
  @ApiOperation({ summary: "Kill stale connections" })
  @ApiResponse({ status: 200, description: "Stale connections killed" })
  @UseGuards(JwtAuthGuard)
  async killStaleConnections(@Req() req: any) {
    const user = req?.user as User;
    await this.dbService.killStaleConnections(user.id);
  }
}
