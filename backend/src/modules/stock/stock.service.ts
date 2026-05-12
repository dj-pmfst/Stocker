import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { SetStockDto } from './dto/set-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  private async assertProductInWarehouse(
    warehouseId: number,
    productId: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.warehouseId !== warehouseId) {
      throw new NotFoundException('Product not found in this warehouse');
    }
  }

  async findOne(warehouseId: number, productId: number) {
    await this.assertProductInWarehouse(warehouseId, productId);
    const stock = await this.prisma.productStock.findUnique({
      where: { productId },
    });
    return stock ?? { productId, quantity: 0 };
  }

  async set(warehouseId: number, productId: number, dto: SetStockDto) {
    await this.assertProductInWarehouse(warehouseId, productId);
    return this.prisma.productStock.upsert({
      where: { productId },
      create: { productId, quantity: dto.quantity },
      update: { quantity: dto.quantity },
    });
  }

  async increase(
    warehouseId: number,
    productId: number,
    dto: AdjustStockDto,
  ) {
    await this.assertProductInWarehouse(warehouseId, productId);
    return this.prisma.productStock.upsert({
      where: { productId },
      create: { productId, quantity: dto.quantity },
      update: { quantity: { increment: dto.quantity } },
    });
  }

  async decrease(
    warehouseId: number,
    productId: number,
    dto: AdjustStockDto,
  ) {
    await this.assertProductInWarehouse(warehouseId, productId);

    const current = await this.prisma.productStock.findUnique({
      where: { productId },
    });
    const currentQty = current?.quantity ?? 0;
    if (currentQty < dto.quantity) {
      throw new BadRequestException(
        `Not enough stock. Current: ${currentQty}, requested: ${dto.quantity}`,
      );
    }

    return this.prisma.productStock.update({
      where: { productId },
      data: { quantity: { decrement: dto.quantity } },
    });
  }
}
