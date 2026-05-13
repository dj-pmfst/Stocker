import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';



@ApiTags('Alerts')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({
    summary: 'Ručno kreiraj upozorenje',
    description: 'Admin može kreirati upozorenje ručno.',
  })
  @ApiCreatedResponse({ description: 'Alert created.' })
  create(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() dto: CreateAlertDto,
  ) {
    return this.alertService.create(warehouseId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista upozorenja',
    description: 'Vraća sva upozorenja za proizvode u skladištu.',
  })
  @ApiOkResponse({ description: 'List of alerts.' })
  findAll(
    @Param('warehouseId', ParseIntPipe) warehouseId: number
    
  ) {
    return this.alertService.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Pojedino upozorenje',
    description: 'Detalji upozorenja sa proizvod info.',
  })
  @ApiOkResponse({ description: 'Alert details.' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.alertService.findOne(warehouseId, id);
  }

  @Patch(':id/resolve')
  @ApiOperation({
    summary: 'Označi upozorenje kao riješeno',
    description: 'Postavi `rijeseno: true`. Upozorenje ostaje u bazi za povijest, ali ne prikazuje se na aktivnoj listi.',
  })
  @ApiOkResponse({ description: 'Alert resolved.' })
  resolve(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.alertService.resolve(warehouseId, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Obriši upozorenje',
    description: 'Potpuno briše upozorenje.',
  })
  @ApiOkResponse({ description: 'Alert deleted.' })
  remove(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.alertService.remove(warehouseId, id);
  }
}
