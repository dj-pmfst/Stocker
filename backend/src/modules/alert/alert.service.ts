import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertService {
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

  async create(warehouseId: number, dto: CreateAlertDto) {
    await this.assertProductInWarehouse(warehouseId, dto.productId);
    return this.prisma.alert.create({
      data: {
        productId: dto.productId,
        type: dto.type,
        message: dto.message,
      },
    });
  }

  findAll(warehouseId: number, resolved?: boolean) {
    return this.prisma.alert.findMany({
      where: {
        product: { warehouseId: warehouseId   },
        ...(resolved !== undefined && { resolved }),
      },
      include: {
        product: { include: { defaultProduct: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(warehouseId: number, id: number) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!alert || alert.product.warehouseId !== warehouseId) {
      throw new NotFoundException('Alert not found in this warehouse');
    }
    return alert;
  }

  async resolve(warehouseId: number, id: number) {
    await this.findOne(warehouseId, id);
    return this.prisma.alert.update({
      where: { id },
      data: { resolved: true },
    });
  }

  async remove(warehouseId: number, id: number) {
    await this.findOne(warehouseId, id);
    return this.prisma.alert.delete({ where: { id } });
  }
}
