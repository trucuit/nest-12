import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from 'src/module/orders/entities/order.entity';
import { OrderService } from 'src/module/orders/orders/orders.service';

@Injectable()
export class OrderCronService {
  private readonly logger = new Logger(OrderCronService.name);

  constructor(private readonly orderService: OrderService) {}

  @Cron(CronExpression.EVERY_30_SECONDS) // Run every minute
  async handleCron() {
    this.logger.log('Checking for pending orders to update...');

    const pendingOrders = await this.orderService.getPendingOrders();

    for (const order of pendingOrders) {
      await this.orderService.updateOrderStatus(
        order.id,
        OrderStatus.CONFIRMED,
      );
      this.logger.log(`Order ${order.id} status updated to "success".`);
    }

    if (pendingOrders.length === 0) {
      this.logger.log('No pending orders found.');
    }
  }
}
