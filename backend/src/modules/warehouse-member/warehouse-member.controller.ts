import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { WarehouseMemberService } from './warehouse-member.service';
import { CreateWarehouseMemberDto } from './dto/create-warehouse-member.dto';
import { UpdateWarehouseMemberDto } from './dto/update-warehouse-member.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Warehouse Members')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/members')
export class WarehouseMemberController {
  constructor(
    private readonly warehouseMemberService: WarehouseMemberService,
  ) {}

  @Post()
  @ApiOperation({
  summary: 'Dodaj korisnika u skladište',
  description: 'Veže postojećeg korisnika za skladište s zadanom ulogom (default: KONOBAR).',
})
  @ApiCreatedResponse({ description: 'User added to warehouse.' })
  create(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() dto: CreateWarehouseMemberDto,
  ) {
    return this.warehouseMemberService.create(warehouseId, dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List members of a warehouse.' })
  @ApiOperation({ summary: 'Lista članova skladišta' })
  findAll(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.warehouseMemberService.findAll(warehouseId);
  }

  @Get(':userId')
  @ApiOkResponse({ description: 'Specific member.' })
  @ApiOperation({ summary: 'Pojedini član skladišta' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.warehouseMemberService.findOne(warehouseId, userId);
  }

  @Patch(':userId')
  @ApiOkResponse({ description: 'Member role updated.' })
  @ApiOperation({
  summary: 'Promijeni ulogu člana',
  description: 'Ažurira ulogu korisnika u danom skladištu (npr. promovira KONOBAR-a u SKLADISTAR-a).',
})
  update(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateWarehouseMemberDto,
  ) {
    return this.warehouseMemberService.update(warehouseId, userId, dto);
  }

  @Delete(':userId')
  @ApiOkResponse({ description: 'Member removed.' })
  @ApiOperation({ summary: 'Izbaci korisnika iz skladišta' })
  remove(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.warehouseMemberService.remove(warehouseId, userId);
  }
}
