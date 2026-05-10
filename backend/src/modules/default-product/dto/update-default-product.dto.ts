import { PartialType } from '@nestjs/swagger';
import { CreateDefaultProductDto } from './create-default-product.dto';

export class UpdateDefaultProductDto extends PartialType(CreateDefaultProductDto) {}
