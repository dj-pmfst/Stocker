import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { UnitOfMeasure } from '../../../generated/prisma/client';

export class CreateDefaultProductDto {
  @ApiProperty({ example: 'Coca-Cola 0.5L' })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ required: false, example: 'Pića' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ enum: UnitOfMeasure, example: 'L' })
  @IsEnum(UnitOfMeasure)
  @IsDefined()
  unitOfMeasure: UnitOfMeasure;

  @ApiProperty({ required: false, example: '330ml' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ required: false, example: ['images/cola.png'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrl?: string[];
}