import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(warehouseId: number, userId: number, dto: CreateDeliveryDto) {
    const productIds = dto.items.map((s) => s.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, warehouseId },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'One or more products do not belong to this warehouse',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const delivery = await tx.deliveryEntry.create({
        data: {
          warehouseId: warehouseId,
          userId: userId,
          shift: dto.shift,
          note: dto.note,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of dto.items) {
        const current = await tx.productStock.findUnique({
          where: { productId: item.productId },
        });
        const currentQty = current?.quantity ?? 0;
        const newQty = currentQty + item.quantity;

        if (newQty > 999) {
          throw new BadRequestException(
            `Stock cannot exceed 999. Current: ${currentQty}, requested: ${item.quantity}`,
          );
        }

        const updatedStock = await tx.productStock.upsert({
          where: { productId: item.productId },
          create: { productId: item.productId, quantity: item.quantity },
          update: { quantity: { increment: item.quantity } },
        });

        const product = products.find((p) => p.id === item.productId);
        const minimum = product?.minimumQuantity;
        if (minimum != null && updatedStock.quantity >= minimum) {
          await tx.alert.updateMany({
            where: { productId: item.productId, resolved: false },
            data: { resolved: true },
          });
        }
      }

      return delivery;
    });
  }

  findAll(warehouseId: number) {
    return this.prisma.deliveryEntry.findMany({
      where: { warehouseId },
      include: {
        items: { include: { product: { include: { defaultProduct: true } } } },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(warehouseId: number, id: number) {
    const delivery = await this.prisma.deliveryEntry.findUnique({
      where: { id },
      include: {
        items: { include: { product: { include: { defaultProduct: true } } } },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    if (!delivery || delivery.warehouseId !== warehouseId) {
      throw new NotFoundException('Delivery not found in this warehouse');
    }
    return delivery;
  }
}
