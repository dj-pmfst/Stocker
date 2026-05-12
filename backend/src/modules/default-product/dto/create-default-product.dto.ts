import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
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
}
