import { Module } from '@nestjs/common';
import { WarehouseMemberService } from './warehouse-member.service';
import { WarehouseMemberController } from './warehouse-member.controller';
import { PrismaModule } from '../../config/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WarehouseMemberController],
  providers: [WarehouseMemberService],
})
export class WarehouseMemberModule {}
