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
  Req
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Warehouses')
@UseGuards(UserAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Warehouse created.' })
  @ApiOperation({
    summary: 'Kreiraj novo skladište',
    description: 'Dodaje novo skladište u sustav. Naziv je obavezan, adresa opcionalna.',
  })
   create(@Body() createWarehouseDto: CreateWarehouseDto, @Req() req) {
    return this.warehouseService.create(createWarehouseDto, req.user.id);
  }

  @Get() //maknuti ovaj endpoint jer je viška -> postoji end point koji vraća skladišta kojima korisnik ima pristup
  @ApiOkResponse({ description: 'List all warehouses.' })
  @ApiOperation({
    summary: 'Dohvati sva skladišta',
    description: 'Vraća listu svih skladišta u sustavu.',
  })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Warehouse by id.' })
   @ApiOperation({
    summary: 'Dohvati skladište po ID-u',
    description: 'Vraća detalje pojedinog skladišta. 404 ako ne postoji.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':warehouseId')
  @Roles('ADMIN') 
  @ApiOkResponse({ description: 'Warehouse updated.' })
   @ApiOperation({
    summary: 'Update podataka skladišta',
    description: 'Mijenja naziv i/ili adresu postojećeg skladišta.',
  })
  update(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(warehouseId, updateWarehouseDto);
  }

  @Delete(':warehouseId')
  @Roles('ADMIN') 
  @ApiOkResponse({ description: 'Warehouse deleted.' })
    @ApiOperation({
    summary: 'Obriši skladište',
    description: 'Brisanje kaskadno briše sve članove (KorisnikSkladiste) i proizvode unutar skladišta.',
  })
  remove(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.warehouseService.remove(warehouseId);
  }
}
