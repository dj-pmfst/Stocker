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
    return product;
  }

  private async syncAlerts(
    tx: any,
    productId: number,
    newQuantity: number,
    minimumQuantity: number | null,
  ) {
    if (minimumQuantity == null) return;

    if (newQuantity < minimumQuantity) {
      const existing = await tx.alert.findFirst({
        where: { productId, resolved: false },
      });
      if (!existing) {
        const type = newQuantity <= 0 ? 'RED' : 'YELLOW';
        const message =
          newQuantity <= 0
            ? 'Out of stock!'
            : `Stock below minimum (${newQuantity} < ${minimumQuantity})`;
        await tx.alert.create({
          data: { productId, type, message },
        });
      }
    } else {
      await tx.alert.updateMany({
        where: { productId, resolved: false },
        data: { resolved: true },
      });
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
    const product = await this.assertProductInWarehouse(warehouseId, productId);
     if (dto.quantity > 999) {
    throw new BadRequestException(`Stock cannot exceed 999. Requested: ${dto.quantity}`);
  }
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.productStock.upsert({
        where: { productId },
        create: { productId, quantity: dto.quantity },
        update: { quantity: dto.quantity },
      });
      await this.syncAlerts(tx, productId, updated.quantity, product.minimumQuantity);
      return updated;
    });
  }

  async increase(
    warehouseId: number,
    productId: number,
    dto: AdjustStockDto,
  ) {
    const product = await this.assertProductInWarehouse(warehouseId, productId);
     if (dto.quantity > 999) {
    throw new BadRequestException(`Stock cannot exceed 999. Requested: ${dto.quantity}`);
  }
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.productStock.upsert({
        where: { productId },
        create: { productId, quantity: dto.quantity },
        update: { quantity: { increment: dto.quantity } },
      });
      await this.syncAlerts(tx, productId, updated.quantity, product.minimumQuantity);
      return updated;
    });
  }

  async decrease(
    warehouseId: number,
    productId: number,
    dto: AdjustStockDto,
  ) {
    const product = await this.assertProductInWarehouse(warehouseId, productId);

    const current = await this.prisma.productStock.findUnique({
      where: { productId },
    });
    const currentQty = current?.quantity ?? 0;
    if (currentQty < dto.quantity) {
      throw new BadRequestException(
        `Not enough stock. Current: ${currentQty}, requested: ${dto.quantity}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.productStock.update({
        where: { productId },
        data: { quantity: { decrement: dto.quantity } },
      });
      await this.syncAlerts(tx, productId, updated.quantity, product.minimumQuantity);
      return updated;
    });
  }
}
