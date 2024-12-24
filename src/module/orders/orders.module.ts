// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCronService } from 'src/cron/order-cron.service';
import { MailQueueModule } from 'src/mail-queue/mail-queue.module';
import { CartModule } from 'src/module/cart/cart.module';
import { ProductModule } from 'src/module/products/product.module';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './orders/orders.controller';
import { OrderService } from './orders/orders.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    RedisModule,
    CartModule,
    ProductModule,
    MailQueueModule,
  ],
  providers: [OrderService, OrderCronService],
  controllers: [OrderController],
})
export class OrdersModule {}
