import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CsvService } from './csv.service';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductController } from './products.controller';
import { OpenAIModule } from '../open-ai/open-ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    OpenAIModule,
  ],
  controllers: [ProductController],
  providers: [ProductsService, CsvService],
  exports: [CsvService],
})
export class ProductsModule {}
