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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Warehouses')
@UseGuards(UserAuthGuard)
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
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
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

  @Patch(':id')
  @ApiOkResponse({ description: 'Warehouse updated.' })
   @ApiOperation({
    summary: 'Update podataka skladišta',
    description: 'Mijenja naziv i/ili adresu postojećeg skladišta.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Warehouse deleted.' })
    @ApiOperation({
    summary: 'Obriši skladište',
    description: 'Brisanje kaskadno briše sve članove (KorisnikSkladiste) i proizvode unutar skladišta.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.remove(id);
  }
}
