import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

class AlertQueryDto {
  @ApiPropertyOptional({ example: false, description: 'Filtriraj po riješenosti (true/false)' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  resolved?: boolean;
}

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
    description: 'Vraća sva upozorenja za proizvode u skladištu. Filter `?rijeseno=false` za samo aktivna.',
  })
  @ApiOkResponse({ description: 'List of alerts.' })
  findAll(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() query: AlertQueryDto,
  ) {
    return this.alertService.findAll(warehouseId, query.resolved);
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
