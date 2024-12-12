// src/orders/dto/create-order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'p1',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product Name',
    example: 'Wireless Mouse',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 25.5,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

/*
payload items for POST /order/confirm
{
  "address": "123 Street, City",
  "phoneNumber": "1234567890",
  "items": [
    {
      "productId": "1",
      "productName": "Wireless Mouse",
      "price": 25.5,
      "quantity": 2
    },
    {
      "productId": "2",
      "productName": "Keyboard",
      "price": 50.0,
      "quantity": 1
    }
  ]
}


*/
