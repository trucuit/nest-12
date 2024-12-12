// src/orders/dto/order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'List of items in the order',
    type: [OrderItem],
  })
  items: OrderItem[];

  @ApiProperty({
    description: 'Total amount of the order',
    example: 51.0,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Status of the order',
    example: 'Confirmed',
  })
  status: string;

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, City, Country',
  })
  address: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2023-10-07T14:48:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Order last update date',
    example: '2023-10-07T14:50:00.000Z',
  })
  updatedAt: Date;
}
