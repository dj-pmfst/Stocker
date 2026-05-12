import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';
import { Role } from '../../../generated/prisma/client';

export class UpdateWarehouseMemberDto {
  @ApiProperty({ enum: Role, example: 'WAREHOUSE_MANAGER' })
  @IsEnum(Role)
  @IsDefined()
  role: Role;
}