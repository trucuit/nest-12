// src/order/dto/create-order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'The ID of the product to order',
    example: 'p1',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
