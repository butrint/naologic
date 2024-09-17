import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Image, ImageSchema } from './image.schema';

@Schema()
export class Variant {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: Boolean })
  available?: boolean;

  @Prop({ type: Object })
  attributes?: {
    packaging: string | undefined;
    description: string | undefined;
  };

  @Prop({ type: Number })
  cost?: number;

  @Prop({ type: Number })
  depth?: number | null;

  @Prop({ type: String })
  dimensionUom?: string | null;

  @Prop({ type: String })
  currency?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  manufacturerItemCode?: string;

  @Prop({ type: String })
  manufacturerItemId?: string;

  @Prop({ type: String })
  packaging?: string;

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: String })
  optionName?: string | null;

  @Prop({ type: String })
  optionsPath?: string | null;

  @Prop({ type: String })
  optionItemsPath?: string | null;

  @Prop({ type: String })
  sku?: string;

  @Prop({ type: Boolean })
  active?: boolean;

  @Prop({
    type: [ImageSchema],
  })
  images?: Image[];

  @Prop({ type: String, index: { unique: true } })
  itemCode?: string;

  @Prop({ type: Number })
  volume?: number | null;

  @Prop({ type: String })
  volumeUom?: string | null;

  @Prop({ type: Number })
  weight?: number | null;

  @Prop({ type: String })
  weightUom?: string | null;

  @Prop({ type: Number })
  height?: number | null;

  @Prop({ type: Number })
  width?: number | null;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
