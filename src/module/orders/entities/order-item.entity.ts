// src/order/entities/order-item.entity.ts
import { ProductEntity } from 'src/module/products/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => ProductEntity, { eager: true })
  product: ProductEntity;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;
}

/*

// payload for POST /order/confirm
{
  "address": "123 Street, City",
  "phoneNumber": "1234567890",
  "items": [
    {
      "productId": "1",
      "price": 100,
      "quantity": 2
    },
    {
      "productId": "2",
      "price": 200,
      "quantity": 1
    }
  ]
}
 
*/
