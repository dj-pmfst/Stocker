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

export class DeliveryItemDto {
  @ApiProperty({ example: 1, description: 'ID proizvoda u skladištu' })
  @IsInt()
  @IsDefined()
  productId: number;

  @ApiProperty({ example: 50, description: 'Kolicina koja je stigla' })
  @IsNumber()
  @Min(0.0001)
  @IsDefined()
  quantity: number;

  @ApiProperty({ required: false, example: 8.5, description: 'Nabavna cijena po jedinici (opcionalno)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}

export class CreateDeliveryDto {
  @ApiProperty({ enum: Shift, example: 'JUTARNJA' })
  @IsEnum(Shift)
  @IsDefined()
  shift: Shift;

  @ApiProperty({ required: false, example: 'Tjedna dostava od dobavljača X' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    type: [DeliveryItemDto],
    example: [
      { productId: 1, quantity: 50, price: 8.5 },
      { productId: 2, quantity: 30 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DeliveryItemDto)
  items: DeliveryItemDto[];
}
