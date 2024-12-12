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
