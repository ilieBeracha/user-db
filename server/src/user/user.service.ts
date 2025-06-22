import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthResponseDto } from "src/auth/dto/auth-response.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const user = await this.findByEmail(email);
    if (user) {
      throw new ConflictException("User already exists");
    }
    const newUser = new User();
    newUser.password = password;
    newUser.first_name = firstName;
    newUser.email = email;
    newUser.last_name = lastName;
    return this.userRepository.save(newUser);
  }

  async me(user: User): Promise<AuthResponseDto> {
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!currentUser) {
      throw new UnauthorizedException("User not found");
    }

    return {
      access_token: "access_token",
      refresh_token: "refresh_token",
      user: {
        id: currentUser.id,
        email: currentUser.email,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
      },
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "first_name", "last_name"],
    });
    return user;
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: ["id", "email", "password", "first_name", "last_name"],
    });
  }

  delete(id: string) {
    return this.userRepository.delete(id);
  }
}
