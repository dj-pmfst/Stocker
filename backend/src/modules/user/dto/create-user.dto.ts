import { IsDefined, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  lozinka: string;

  @IsString()
  @IsDefined()
  ime: string;

  @IsString()
  @IsDefined()
  prezime: string;
}
