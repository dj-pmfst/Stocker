import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(warehouseId: number, userId: number, dto: CreateSaleDto) {
    const productIds = dto.items.map((s) => s.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, warehouseId },
      include: { stock: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'One or more products do not belong to this warehouse',
      );
    }

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      const current = product?.stock?.quantity ?? 0;
      if (current < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for product ${item.productId}. Available: ${current}, requested: ${item.quantity}`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.saleEntry.create({
        data: {
          warehouseId,
          userId,
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
        await tx.productStock.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return sale;
    });
  }

  findAll(warehouseId: number) {
    return this.prisma.saleEntry.findMany({
      where: { warehouseId },
      include: {
        items: { include: { product: { include: { defaultProduct: true } } } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(warehouseId: number, id: number) {
    const sale = await this.prisma.saleEntry.findUnique({
      where: { id },
      include: {
        items: { include: { product: { include: { defaultProduct: true } } } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!sale || sale.warehouseId !== warehouseId) {
      throw new NotFoundException('Sale not found in this warehouse');
    }
    return sale;
  }
}
