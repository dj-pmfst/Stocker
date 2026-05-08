import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ example: 'StrongPass1!' })
  @IsString()
  @IsDefined()
  lozinka: string;

  @ApiProperty({ example: 'Ana' })
  @IsString()
  @IsDefined()
  ime: string;

  @ApiProperty({ example: 'Anić' })
  @IsString()
  @IsDefined()
  prezime: string;
}
