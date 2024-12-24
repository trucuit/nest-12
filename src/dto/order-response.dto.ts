// src/order/dto/order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from 'src/module/orders/entities/order-item.entity';
import { OrderStatus } from 'src/module/orders/entities/order.entity';

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID', example: 'o1' })
  id: string;

  @ApiProperty({ description: 'Order items', type: [OrderItem] })
  items: OrderItem[];

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, City, Country',
  })
  address: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ description: 'Order status', example: 'Confirmed' })
  status: OrderStatus;

  @ApiProperty({ description: 'Order creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Order update date' })
  updatedAt: Date;
}
