import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.userService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedLozinka = await bcrypt.hash(registerDto.lozinka, 10);

    const korisnik = await this.userService.create({
      ...registerDto,
      lozinka: hashedLozinka,
    });

    const payload = { sub: korisnik.id, email: korisnik.email };
    const token = this.jwtService.sign(payload);

    const { lozinka: _, ...result } = korisnik;
    return { ...result, accessToken: token };
  }

  async login(loginDto: LoginDto) {
    const korisnik = await this.userService.findByEmail(loginDto.email);
    if (!korisnik) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.lozinka, korisnik.lozinka);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: korisnik.id, email: korisnik.email };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }
}
