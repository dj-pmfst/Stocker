import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class SetLocationDto {
  @ApiProperty({ example: 'A', description: 'Zona u skladištu' })
  @IsString()
  @IsDefined()
  zone: string;

  @ApiProperty({ example: '3', description: 'Polica u zoni' })
  @IsString()
  @IsDefined()
  shelf: string;
}
