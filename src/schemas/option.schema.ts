import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { OPTION_VARIANT } from 'src/common/enums/option-variant.enum';

@Schema()
class OptionItem {
  @Prop({ type: String, index: { unique: true } })
  id?: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  value?: string;
}

export const OptionItemSchema = SchemaFactory.createForClass(OptionItem);

@Schema()
export class Option {
  @Prop({ type: String, index: { unique: true } })
  id?: string;

  @Prop({ type: String, enum: OPTION_VARIANT })
  name?: OPTION_VARIANT;

  @Prop({
    type: [OptionItemSchema],
  })
  values?: OptionItem[];
}

export const OptionSchema = SchemaFactory.createForClass(Option);
