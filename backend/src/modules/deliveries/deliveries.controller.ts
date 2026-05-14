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
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Deliveries')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Registriraj dostavu',
    description:
      'Kreira unos dostave sa stavkama i automatski povećava stanje za sve proizvode. ',
  })
  @ApiCreatedResponse({ description: 'Delivery recorded and stock incremented.' })
  create(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() dto: CreateDeliveryDto,
    @Req() req,
  ) {
    return this.deliveriesService.create(warehouseId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista dostava u skladištu',
    description: 'Vraća sve unose dostave za dato skladište, najnovije prvo',
  })
  @ApiOkResponse({ description: 'List deliveries.' })
  findAll(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.deliveriesService.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Pojedini unos dostave',
    description: 'Vraća detalje jedne dostave sa svim stavkama i korisnikom koji ju je registrirao.',
  })
  @ApiOkResponse({ description: 'Delivery details.' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deliveriesService.findOne(warehouseId, id);
  }
}
