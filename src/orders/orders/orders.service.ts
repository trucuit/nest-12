// src/orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/module/products/product.service';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
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
  ) {}

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  async confirmOrder(
    userId: string,
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
      status: OrderStatus.CONFIRMED,
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
        product: product,
        price: product.price,
        quantity: item.quantity,
      });

      order.items.push(orderItem);
    }

    // save Order
    await this.ordersRepository.save(order);

    // remove from redis
    await this.redisService.getClient().del(this.getCartKey(userId));

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
}
