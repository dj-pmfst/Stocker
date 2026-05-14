import { Module } from '@nestjs/common';
import { DefaultProductService } from './default-product.service';
import { DefaultProductController } from './default-product.controller';
import { PrismaModule } from '../../config/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DefaultProductController],
  providers: [DefaultProductService],
})
export class DefaultProductModule {}
