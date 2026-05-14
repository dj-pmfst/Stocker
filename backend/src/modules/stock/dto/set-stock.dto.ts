import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, Min } from 'class-validator';

export class SetStockDto {
  @ApiProperty({ example: 100, description: 'Postavi kolicinu na ovu vrijednost' })
  @IsNumber()
  @Min(0)
  @IsDefined()
  quantity: number;
}
