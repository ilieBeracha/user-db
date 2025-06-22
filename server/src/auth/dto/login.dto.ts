import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @Expose() 
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Expose()
  password: string;
}
  