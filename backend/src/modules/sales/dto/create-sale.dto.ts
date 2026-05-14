import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Shift } from '../../../generated/prisma/client';

export class SaleItemDto {
  @ApiProperty({ example: 1, description: 'ID proizvoda u skladištu' })
  @IsInt()
  @IsDefined()
  productId: number;

  @ApiProperty({ example: 2, description: 'Kolicina prodana' })
  @IsNumber()
  @Min(0.0001)
  @IsDefined()
  quantity: number;

  @ApiProperty({ required: false, example: 12.5, description: 'Cijena po jedinici (opcionalno)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}

export class CreateSaleDto {
  @ApiProperty({ enum: Shift, example: 'AFTERNOON' })
  @IsEnum(Shift)
  @IsDefined()
  shift: Shift;

  @ApiProperty({ required: false, example: 'Subota navečer, gust promet' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    type: [SaleItemDto],
    example: [
      { productId: 1, quantity: 5, price: 12.5 },
      { productId: 2, quantity: 2 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}
