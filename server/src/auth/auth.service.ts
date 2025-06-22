import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { AuthResponseDto } from "./dto/auth-response.dto";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponseDto> {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userService.register(
      email,
      hash,
      firstName,
      lastName
    );
    return this.buildAuthResponse(user);
  }

  async login(user: User): Promise<AuthResponseDto> {
    const currUser = await this.userService.findOne(user.id);
    if (!currUser) {
      throw new UnauthorizedException("User not found");
    }
    return this.buildAuthResponse(currUser);
  }

  private async buildAuthResponse(user: User): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(user);
    return {
      user: this.getUserData(user),
      ...tokens,
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async refresh(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
      });

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  private async generateTokens(
    user: User
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || "secret",
      expiresIn: "1d",
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
      expiresIn: "7d",
    });

    return { access_token, refresh_token };
  }

  private getUserData(user: User) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }
}
