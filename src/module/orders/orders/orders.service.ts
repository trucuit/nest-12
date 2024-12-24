// src/orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailQueueService } from '../../../mail-queue/mail-queue.service';
import { RedisService } from '../../../redis/redis.service';
import { ProductService } from '../../products/product.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order, OrderStatus } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    private redisService: RedisService,
    private productsService: ProductService, // Inject ProductsService
    private readonly mailQueueService: MailQueueService,
  ) {}

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  async confirmOrder(
    userId: string,
    userEmail: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const { address, phoneNumber, items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống.');
    }

    // get products from ProductsService
    const productIds = items.map((item) => item.productId);
    const products = await this.productsService.findByIds(productIds);

    if (products.length !== items.length) {
      throw new NotFoundException('One or more products not found.');
    }

    // create Order
    const order = this.ordersRepository.create({
      user: { id: userId }, // TypeORM will automatically convert this to UserEntity
      address,
      phoneNumber,
      status: OrderStatus.PENDING,
      items: [],
    });

    // Tạo OrderItems
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found.`,
        );
      }

      // Create OrderItem
      const orderItem = this.orderItemsRepository.create({
        order: order, // Associate OrderItem with Order
        product: product,
        price: product.price,
        quantity: item.quantity,
      });

      order.items.push(orderItem);
    }

    // save Order
    await this.ordersRepository.save(order);
    await this.orderItemsRepository.save(order.items); // Save OrderItems

    // remove from redis
    await this.redisService.getClient().del(this.getCartKey(userId));

    const emailContent = `Thank you for your order! Your order ID is ${'orderId'}.`;

    await this.mailQueueService.addToQueue(
      userEmail,
      'Order Confirmation',
      emailContent,
    );

    return order;
  }

  async getOrderHistory(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    return order;
  }

  // Get orders that are pending and older than 5 minutes
  async getPendingOrders(): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: {
        status: OrderStatus.PENDING,
      },
    });
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.ordersRepository.update(orderId, { status });
  }
}
