/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getMappedCSVToProduct } from 'src/common/utils/csv-maping';
import { CSVResponseDTO } from 'src/dtos/CSVResponse.dto';
import { Option } from 'src/schemas/option.schema';
import { Product } from 'src/schemas/product.schema';
import { Variant } from 'src/schemas/variant.schema';
import { OpenAIService } from '../open-ai/open-ai.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private openAIService: OpenAIService,
  ) {}

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findOne({ _id: id }).exec();
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOneByProductId(productId: string) {
    return this.productModel.findOne({ productId }).exec();
  }

  async bulkCreateFromCSV(csvData: CSVResponseDTO[]) {
    try {
      for (const csvRow of csvData) {
        const product = getMappedCSVToProduct(csvRow);
        const existingProduct = await this.findOneByProductId(
          product.productId!,
        );

        if (!existingProduct) {
          await this.create(product);
          continue;
        }

        await this.updateProduct(existingProduct, product);
      }

      this.logger.log(`Effected ${csvData.length} rows`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async updateProduct(
    existingProduct: Product,
    incomingProduct: Partial<Product>,
  ): Promise<void> {
    try {
      const updatedVariant = incomingProduct.data!.variants![0];
      const updatedVariants = await this.getUpdatedVariantsForProduct(
        existingProduct.data?.variants,
        updatedVariant,
      );

      const packagingOption = incomingProduct.data!.options![0];
      const itemDescriptionOption = incomingProduct.data!.options![1];
      const updatedOptions = await this.getUpdatedOptionsForProduct(
        existingProduct.data.options!,
        [packagingOption, itemDescriptionOption],
      );

      Object.assign(incomingProduct, existingProduct);

      existingProduct.data.options = updatedOptions;
      existingProduct.data.variants = updatedVariants;

      await existingProduct.save();
    } catch (e) {
      this.logger.error(
        `Coudn't save product with id ${existingProduct.productId}`,
      );
      this.logger.verbose(incomingProduct);
    }
  }

  async getUpdatedOptionsForProduct(
    currOptions: Option[],
    incomingOptions: Option[],
  ): Promise<Option[]> {
    const packagingOptions = currOptions[0];
    const itemDescriptionOptions = currOptions[1];

    const existsPackagingOption = packagingOptions.values?.some(
      (co) => co.name === incomingOptions[0].name,
    );

    const existsItemDescriptionOption = itemDescriptionOptions.values?.some(
      (co) => co.name === incomingOptions[1].name,
    );

    if (!existsPackagingOption) {
      currOptions[0].values!.push(incomingOptions[0]);
    }

    if (!existsItemDescriptionOption) {
      currOptions[1].values!.push(incomingOptions[1]);
    }

    // if we want to update other values from incomingOptions

    return currOptions;
  }

  async getUpdatedVariantsForProduct(
    currVariants: Variant[],
    incomingVariant: Variant,
  ): Promise<Variant[]> {
    const existingVariant = currVariants.find(
      (v) => v.itemCode === incomingVariant.itemCode,
    );

    if (!existingVariant) {
      currVariants.push(incomingVariant);
      return currVariants;
    }

    // if we want to update other values from incomingVariant

    return currVariants;
  }

  async create(product: Partial<Product>): Promise<Product> {
    return this.productModel.create(product);
  }

  async remove(id: string) {
    const productToBeDeleted = await this.findOne(id);

    if (!productToBeDeleted) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    productToBeDeleted.info!.deletedAt = new Date();

    await productToBeDeleted.save();
  }
}
