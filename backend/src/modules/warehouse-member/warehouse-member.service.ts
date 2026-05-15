import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWarehouseMemberDto } from './dto/create-warehouse-member.dto';
import { UpdateWarehouseMemberDto } from './dto/update-warehouse-member.dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class WarehouseMemberService {
  constructor(private prisma: PrismaService) {}

  async create(warehouseId: number, dto: CreateWarehouseMemberDto) {
     const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${dto.userId} not found`);
    }
    const existing = await this.prisma.userWarehouse.findUnique({
      where: {
        userId_warehouseId: { userId: dto.userId, warehouseId: warehouseId },
      },
    });
    if (existing) {
      throw new ConflictException('User is already a member of this warehouse');
    }

    return this.prisma.userWarehouse.create({
      data: { userId: dto.userId, warehouseId, role: dto.role },
    });
  }

  findAll(warehouseId: number) {
    return this.prisma.userWarehouse.findMany({
      where: { warehouseId: warehouseId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(warehouseId: number, userId: number) {
    const member = await this.prisma.userWarehouse.findUnique({
      where: { userId_warehouseId: { userId, warehouseId } },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
    if (!member) throw new NotFoundException('Member not found in warehouse');
    return member;
  }

  async update(
    warehouseId: number,
    userId: number,
    dto: UpdateWarehouseMemberDto,
  ) {
    await this.findOne(warehouseId, userId);
    return this.prisma.userWarehouse.update({
      where: { userId_warehouseId: { userId, warehouseId } },
      data: { role: dto.role },
    });
  }

  async remove(warehouseId: number, userId: number) {
    await this.findOne(warehouseId, userId);
    return this.prisma.userWarehouse.delete({
      where: { userId_warehouseId: { userId, warehouseId } },
    });
  }
}
