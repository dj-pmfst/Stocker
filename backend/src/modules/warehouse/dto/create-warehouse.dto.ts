import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Main Warehouse' })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ required: false, example: '123 Main St' })
  @IsString()
  @IsOptional()
  address?: string;
}