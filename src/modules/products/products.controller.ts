// import { Controller, Get, Param, Patch, Body, Delete } from '@nestjs/common';
import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
