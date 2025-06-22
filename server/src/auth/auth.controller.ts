import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered",
    type: AuthResponseDto,
  })
  register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName
    );
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login a user" })
  @ApiResponse({
    status: 200,
    description: "User logged in",
    type: AuthResponseDto,
  })
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOperation({ summary: "Refresh a user token" })
  @ApiResponse({
    status: 200,
    description: "User token refreshed",
    type: AuthResponseDto,
  })
  refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }
}
