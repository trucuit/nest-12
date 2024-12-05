import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  // TODO: what is readonly?
  @IsString()
  @IsOptional()
  readonly description?: string;

  // TODO: what is readonly?
  @IsUUID()
  @IsOptional()
  readonly parentId?: string;
}
