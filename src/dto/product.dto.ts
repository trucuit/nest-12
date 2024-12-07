import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price?: number;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsUUID()
  readonly categoryId: string;
}
