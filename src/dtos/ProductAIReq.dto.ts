import { IsString } from 'class-validator';

export class ProductAIReqDTO {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;
}
