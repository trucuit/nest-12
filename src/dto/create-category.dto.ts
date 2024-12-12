import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsUUID()
  @IsOptional()
  readonly parentId?: string;
}

/*

// data payload
{
  "name": "category 1",
  "description": "description 1",
  "parentId": "d0b3b3b3-0b3b-4b3b-8b3b-0b3b3b3b3b3b"
}

*/
