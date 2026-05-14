import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(warehouseId: number, dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: {
        defaultProductId_warehouseId: {
          defaultProductId: dto.defaultProductId,
          warehouseId,
        },
      },
    });
    if (existing) {
      throw new ConflictException(
        'This product already exists in the warehouse',
      );
    }

    return this.prisma.product.create({
      data: {
        defaultProductId: dto.defaultProductId,
        warehouseId,
        minimumQuantity: dto.minimumQuantity,
        customName: dto.customName,
        stock: { create: { quantity: 0 } },
        ...(dto.storageZone && dto.shelfNumber
          ? {
              location: {
                create: {
                  zone: dto.storageZone,
                  shelf: String(dto.shelfNumber),
                },
              },
            }
          : {}),
      },
      include: { defaultProduct: true, stock: true, location: true },
    });
  }

  findAll(warehouseId: number, search?: string) {
    return this.prisma.product.findMany({
      where: {
        warehouseId,
        ...(search && {
          OR: [
            { customName: { contains: search, mode: 'insensitive' } },
            {
              defaultProduct: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        }),
      },
      include: {
        defaultProduct: true,
        stock: true,
        location: true,
      },
    });
  }

  async findOne(warehouseId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        defaultProduct: true,
        stock: true,
        location: true,
      },
    });
    if (!product || product.warehouseId !== warehouseId) {
      throw new NotFoundException('Product not found in this warehouse');
    }
    return product;
  }

  async update(warehouseId: number, id: number, dto: UpdateProductDto) {
    await this.findOne(warehouseId, id);
    return this.prisma.product.update({
      where: { id },
      data: {
        minimumQuantity: dto.minimumQuantity,
        customName: dto.customName,
      },
      include: { defaultProduct: true },
    });
  }

  async remove(warehouseId: number, id: number) {
    await this.findOne(warehouseId, id);
    return this.prisma.product.delete({ where: { id } });
  }
}
