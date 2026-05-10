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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Products')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('warehouses/:warehouseId/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Dodaj proizvod u skladište',
    description: 'Kreira instancu proizvoda u skladištu',
  })
  @ApiCreatedResponse({ description: 'Product added to warehouse.' })
  create(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(warehouseId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista proizvoda u skladištu',
    description: 'Vraća sve proizvode unutar skladišta.',
  })
  @ApiOkResponse({ description: 'List products in warehouse.' })
  findAll(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.productService.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Dohvati pojedini proizvod u skladištu',
    description: 'Vraća detalje proizvoda.',
  })
  @ApiOkResponse({ description: 'Product details.' })
  findOne(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.findOne(warehouseId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update proizvoda u skladištu',
    description: 'Mijenja minimalnu količinu ili custom naziv.',
  })
  @ApiOkResponse({ description: 'Product updated.' })
  update(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(warehouseId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Ukloni proizvod iz skladišta',
    description: 'Briše proizvod iz skladišta.',
  })
  @ApiOkResponse({ description: 'Product removed from warehouse.' })
  remove(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.remove(warehouseId, id);
  }
}
