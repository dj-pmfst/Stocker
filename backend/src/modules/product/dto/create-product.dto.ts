import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID stavke iz kataloga (DefaultProduct)' })
  @IsInt()
  @IsDefined()
  defaultProductId: number;

  @ApiProperty({ required: false, example: 20, description: 'Minimalna količina prije upozorenja' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumQuantity?: number;

  @ApiProperty({ required: false, example: 'Cola Mala', description: 'Lokalni naziv (override default-a)' })
  @IsString()
  @IsOptional()
  customName?: string;

  @ApiProperty({ required: false, example: 'A' })
  @IsString()
  @IsOptional()
  storageZone?: string;

  @ApiProperty({ required: false, example: '3' })
  @IsString()
  @IsOptional()
  shelfNumber?: string;
}