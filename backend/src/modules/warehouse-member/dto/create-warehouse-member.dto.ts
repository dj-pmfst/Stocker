import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Role } from '../../../generated/prisma/client';

export class CreateWarehouseMemberDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @IsDefined()
  userId: number;

  @ApiProperty({ enum: Role, example: 'WAITER', required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
