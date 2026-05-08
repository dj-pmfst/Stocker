import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ example: 'StrongPass1!' })
  @IsString()
  @IsDefined()
  password: string;
}
