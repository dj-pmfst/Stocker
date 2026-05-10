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
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List all warehouses.' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Warehouse by id.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Warehouse updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Warehouse deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.remove(id);
  }
}
