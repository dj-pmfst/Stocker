import {
  Controller,
  Get,
  Put,
  Delete,
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
import { LocationService } from './location.service';
import { SetLocationDto } from './dto/set-location.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Location')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/products/:productId/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({
    summary: 'Dohvati lokaciju proizvoda',
    description: 'Vraća zonu i policu gdje se proizvod nalazi u skladištu. 404 ako lokacija nije postavljena.',
  })
  @ApiOkResponse({ description: 'Product location.' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.locationService.findOne(warehouseId, productId);
  }

  @Put()
  @ApiOperation({
    summary: 'Postavi lokaciju proizvoda',
    description: 'Postavi ili promijeni zonu i policu. Ako lokacija ne postoji, kreira je.',
  })
  @ApiOkResponse({ description: 'Location set.' })
  set(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: SetLocationDto,
  ) {
    return this.locationService.set(warehouseId, productId, dto);
  }

  @Delete()
  @ApiOperation({
    summary: 'Ukloni lokaciju proizvoda',
    description: 'Briše zonu/policu za proizvod',
  })
  @ApiOkResponse({ description: 'Location removed.' })
  remove(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.locationService.remove(warehouseId, productId);
  }
}
