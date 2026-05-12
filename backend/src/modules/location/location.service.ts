import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { SetLocationDto } from './dto/set-location.dto';

@Injectable()
export class LocationService {
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
    const location = await this.prisma.location.findUnique({
      where: { productId },
    });
    if (!location) throw new NotFoundException('Location not set for this product');
    return location;
  }

  async set(warehouseId: number, productId: number, dto: SetLocationDto) {
    await this.assertProductInWarehouse(warehouseId, productId);
    return this.prisma.location.upsert({
      where: { productId },
      create: { productId, zone: dto.zone, shelf: dto.shelf },
      update: { zone: dto.zone, shelf: dto.shelf },
    });
  }

  async remove(warehouseId: number, productId: number) {
    await this.assertProductInWarehouse(warehouseId, productId);
    const existing = await this.prisma.location.findUnique({
      where: { productId },
    });
    if (!existing) throw new NotFoundException('Location not set');
    return this.prisma.location.delete({ where: { productId } });
  }
}
