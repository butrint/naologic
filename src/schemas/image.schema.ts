import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Image {
  @Prop({ type: String })
  fileName?: string;

  @Prop({ type: String })
  cdnLink?: string;

  @Prop({ type: Number })
  i?: number;

  @Prop({ type: String, default: null })
  alt?: string | null;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
