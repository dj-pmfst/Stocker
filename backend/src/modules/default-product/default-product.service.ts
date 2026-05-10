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

  //isto kao i za products treba dodati da se moze filtrirati pretraga
  findAll() {
    return this.prisma.defaultProduct.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.defaultProduct.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('DefaultProduct not found');
    return item;
  }

 
}
