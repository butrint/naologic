import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { nanoid } from 'nanoid';
import { Info, InfoSchema } from './info.schema';
import { Variant, VariantSchema } from './variant.schema';
import { Option, OptionSchema } from './option.schema';
import { Image, ImageSchema } from './image.schema';
import { PRODUCT_TYPE } from 'src/common/enums/product-type.enum';
import { DOC_STATUS, DOC_TYPE } from 'src/common/enums/doc.enum';
// import * as nanoid from 'nanoid';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class ProductData {
  @Prop({ type: String })
  name?: string;

  @Prop({ type: String, enum: PRODUCT_TYPE })
  type?: PRODUCT_TYPE;

  @Prop({ type: String, default: '' })
  shortDescription?: string;

  @Prop({ type: String, default: '' })
  description?: string;

  @Prop({ type: String })
  vendorId?: string;

  @Prop({ type: String })
  manufacturerId?: string;

  @Prop({ type: String })
  storefrontPriceVisibility?: string;

  @Prop({ type: [VariantSchema], default: [] })
  variants!: Variant[];

  @Prop({ type: [OptionSchema], default: [] })
  options?: Option[];

  @Prop({ type: String })
  availability?: string;

  @Prop({ type: Boolean })
  isFragile?: boolean;

  @Prop({ type: String })
  published?: string;

  @Prop({ type: Boolean })
  isTaxable?: boolean;

  @Prop({ type: ImageSchema })
  images?: Image;

  @Prop({ type: String })
  categoryId?: string;

  @Prop({ type: String })
  categoryPath?: string;
}

const ProductDataSchema = SchemaFactory.createForClass(ProductData);

@Schema()
export class Product extends Document {
  @Prop({ type: String, index: { unique: true } })
  productId!: string;

  @Prop({ type: String, default: nanoid() })
  docId?: string;

  @Prop({ type: String })
  categoryId?: string;

  @Prop({ type: Boolean })
  immutable?: boolean;

  @Prop({ type: ProductDataSchema })
  data!: ProductData;

  @Prop({ type: String })
  deploymentId?: string;

  @Prop({ type: String, enum: DOC_TYPE })
  docType?: DOC_TYPE;

  @Prop({ type: String })
  namespace?: string;

  @Prop({ type: String })
  companyId?: string;

  @Prop({ type: String, enum: DOC_STATUS })
  status?: DOC_STATUS;

  @Prop({ type: InfoSchema })
  info?: Info;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
