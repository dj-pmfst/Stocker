import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { SetStockDto } from './dto/set-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Stock')
@UseGuards(UserAuthGuard,RolesGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/products/:productId/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({
    summary: 'Trenutno stanje proizvoda',
    description: 'Vraća trenutnu kolicinu proizvoda u skladištu. Ako stanje nije postavljeno, vraća 0.',
  })
  @ApiOkResponse({ description: 'Current stock state.' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.stockService.findOne(warehouseId, productId);
  }

  @Put()
  @Roles('ADMIN', 'WAREHOUSE_MANAGER')
  @ApiOperation({
    summary: 'Postavi stanje proizvoda',
    description: 'Inicijalno postavljanje stanja.',
  })
  @ApiOkResponse({ description: 'Stock set.' })
  set(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: SetStockDto,
  ) {
    return this.stockService.set(warehouseId, productId, dto);
  }

  @Post('increase')
  @Roles('ADMIN', 'WAREHOUSE_MANAGER')
  @ApiOperation({
    summary: 'Povećaj stanje proizvoda',
    description: 'Dodaj kolicinu u stanje',
  })
  @ApiOkResponse({ description: 'Stock increased.' })
  increase(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AdjustStockDto,
  ) {
    return this.stockService.increase(warehouseId, productId, dto);
  }

  @Post('decrease')
  @Roles('ADMIN', 'WAREHOUSE_MANAGER')
  @ApiOperation({
    summary: 'Smanji stanje proizvoda',
    description: 'Oduzmi kolicinu od stanja. Fail ako nema dovoljno na stanju.',
  })
  @ApiOkResponse({ description: 'Stock decreased.' })
  decrease(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AdjustStockDto,
  ) {
    return this.stockService.decrease(warehouseId, productId, dto);
  }
}
