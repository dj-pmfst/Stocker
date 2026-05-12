import {
  Controller,
  Get,
  Post,
  Body,  
  Param,  
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
import { DefaultProductService } from './default-product.service';
import { CreateDefaultProductDto } from './dto/create-default-product.dto';
import { UserAuthGuard } from '../auth/user-auth.guard';

@ApiTags('Default Products')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('default-products')
export class DefaultProductController {
  constructor(
    private readonly defaultProductService: DefaultProductService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Dodaj proizvod u katalog',
    description: 'Dodaje novi proizvod u globalni katalog (naziv, kategorija, jedinica mjere).',
  })
  @ApiCreatedResponse({ description: 'Catalog item created.' })
  create(@Body() dto: CreateDefaultProductDto) {
    return this.defaultProductService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Dohvati cijeli katalog',
    description: 'Vraća sve proizvode iz globalnog kataloga.',
  })
  @ApiOkResponse({ description: 'List catalog items.' })
  findAll() {
    return this.defaultProductService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Dohvati pojedini proizvod iz kataloga',
    description: 'Vraća detalje jednog proizvoda iz kataloga po ID-u.',
  })
  @ApiOkResponse({ description: 'Catalog item.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.defaultProductService.findOne(id);
  }
  
}
