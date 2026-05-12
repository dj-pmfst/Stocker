import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsInt, IsString } from 'class-validator';
import { AlertType } from '../../../generated/prisma/client';

export class CreateAlertDto {
  @ApiProperty({ example: 1, description: 'ID proizvoda na kojeg se upozorenje odnosi' })
  @IsInt()
  @IsDefined()
  productId: number;

  @ApiProperty({ enum: AlertType, example: 'YELLOW' })
  @IsEnum(AlertType)
  @IsDefined()
  type: AlertType;

  @ApiProperty({ example: 'Pivo blizu minimalne količine' })
  @IsString()
  @IsDefined()
  message: string;
}
