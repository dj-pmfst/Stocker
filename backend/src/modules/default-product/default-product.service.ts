import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDefaultProductDto } from './dto/create-default-product.dto';
import { UpdateDefaultProductDto } from './dto/update-default-product.dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class DefaultProductService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDefaultProductDto) {
    return this.prisma.defaultProduct.create({ data: dto });
  }

   findAll(search?: string) {
    return this.prisma.defaultProduct.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.defaultProduct.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('DefaultProduct not found');
    return item;
  }

  async update(id: number, dto: UpdateDefaultProductDto) {
    await this.findOne(id);
    return this.prisma.defaultProduct.update({ where: { id }, data: dto });
  }
  
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.defaultProduct.delete({ where: { id } });
  }

 
}
