import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, Min } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({ example: 5, description: 'Kolicina za povećati/smanjiti' })
  @IsNumber()
  @Min(1)
  @IsDefined()
  quantity: number;
}
