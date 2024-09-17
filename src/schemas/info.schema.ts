import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Info {
  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: String, default: null })
  deletedBy?: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const InfoSchema = SchemaFactory.createForClass(Info);
