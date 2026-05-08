import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.korisnik.create({
      data: createUserDto,
    });
  }

  findByEmail(email: string) {
    return this.prisma.korisnik.findUnique({
      where: { email },
    });
  }

  async findOne(id: number) {
    const korisnik = await this.prisma.korisnik.findUnique({
      where: { id },
    });
    if (!korisnik) throw new NotFoundException('Korisnik not found');
    const { lozinka, ...result } = korisnik;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const korisnik = await this.prisma.korisnik.update({
      where: { id },
      data: updateUserDto,
    });
    const { lozinka, ...result } = korisnik;
    return result;
  }
}
