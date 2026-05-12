import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './config/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { WarehouseMemberModule } from './modules/warehouse-member/warehouse-member.module';
import { DefaultProductModule } from './modules/default-product/default-product.module';
import { ProductModule } from './modules/product/product.module';
import { StockModule } from './modules/stock/stock.module';
import { LocationModule } from './modules/location/location.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    WarehouseModule,
    WarehouseMemberModule,
    DefaultProductModule,
    ProductModule,
    StockModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
