import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  create(createWarehouseDto: CreateWarehouseDto, userId: number) {
    return this.prisma.warehouse.create({
      data: {
        ...createWarehouseDto,
        userWarehouses: {
          create: { userId, role: 'ADMIN' },
        },
      },
      include: { userWarehouses: true },
    });
  }

  findAll() {
    return this.prisma.warehouse.findMany();
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    await this.findOne(id);
    return this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.warehouse.delete({
      where: { id },
    });
  }
}
