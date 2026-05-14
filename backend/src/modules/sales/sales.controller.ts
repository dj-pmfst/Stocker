import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Sales')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({
    summary: 'Registriraj prodaju',
    description:
      'Kreira unos prodaje sa stavkama i automatski smanjuje stanje za sve proizvode.',
  })
  @ApiCreatedResponse({ description: 'Sale recorded and stock decremented.' })
  create(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() dto: CreateSaleDto,
    @Req() req,
  ) {
    return this.salesService.create(warehouseId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista prodaja u skladištu',
    description: 'Vraća sve unose prodaje za  skladište, najnovije prvo.',
  })
  @ApiOkResponse({ description: 'List sales.' })
  findAll(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.salesService.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Pojedini unos prodaje',
    description: 'Vraća detalje jedne prodaje sa svim stavkama i korisnikom koji ju je registrirao.',
  })
  @ApiOkResponse({ description: 'Sale details.' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.salesService.findOne(warehouseId, id);
  }
}
