import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  id?: string;
  @IsNumber()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  price: number;
}
