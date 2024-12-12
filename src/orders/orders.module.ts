// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/module/cart/cart.module';
import { RedisModule } from '../redis/redis.module';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { ProductModule } from 'src/module/products/product.module';
import { OrderController } from './orders/orders.controller';
import { OrderService } from './orders/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    RedisModule,
    CartModule,
    ProductModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrdersModule {}
