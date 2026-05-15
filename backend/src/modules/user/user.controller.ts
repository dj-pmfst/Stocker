import { Controller, Get, Put, Body, Req, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Users')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Dohvati sve korisnike',
    description: 'Vraća listu svih registriranih korisnika (bez lozinki).',
  })
  @ApiOkResponse({ description: 'List of all users.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Moj profil',
    description: 'Vraća podatke trenutno ulogiranog korisnika',
  })
  @ApiOkResponse({ description: 'Current user profile.' })
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Dohvati korisnika po ID-u',
    description: 'Vraća javne podatke korisnika po ID-u. Lozinka se nikad ne vraća. 404 ako korisnik ne postoji.',
  })
  @ApiOkResponse({ description: 'User details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put('me')
  @ApiOperation({
    summary: 'Update mog profila',
    description: 'Mijenja podatke trenutno ulogiranog korisnika. Lozinka se može mijenjati ali se NE hashira ovdje — koristi poseban endpoint za change-password ako ga dodaš.',
  })
  @ApiOkResponse({ description: 'Profile updated.' })
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Get('me/warehouses')
  @ApiOperation({
    summary: 'Moje skladište',
    description: 'Vraća listu skladišta kojima korisnik ima pristup, zajedno s njegovom ulogom u svakom od njih.',
  })
  @ApiOkResponse({ description: 'List of user warehouses.' })
  getMyWarehouses(@Req() req) {
    return this.userService.findWarehouses(req.user.id);
  }
}