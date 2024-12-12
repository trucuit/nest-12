import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import * as Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CartService {
  private redisClient: Redis.Redis;

  constructor(
    private redisService: RedisService,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  // check if product exists
  async productExists(productId: string): Promise<boolean> {
    // check if productId is valid from product database
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return true;
  }

  // add or update item in cart
  async addOrUpdateItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    if (!(await this.productExists(productId))) return;

    // save item to redis
    const itemData = JSON.stringify({ productId, quantity });
    await this.redisClient.hset(this.getCartKey(userId), productId, itemData);
  }

  // get all items in cart
  async getCart(userId: string): Promise<any[]> {
    const cartKey = this.getCartKey(userId);
    const entries = await this.redisClient.hgetall(cartKey);

    // convert object to array
    const items = Object.values(entries).map((data) => JSON.parse(data));
    // get more info of product from database and return to client
    for (let i = 0; i < items.length; i++) {
      const product = await this.productRepository.findOne({
        where: { id: items[i].productId },
      });
      items[i] = { ...items[i], product };
    }

    return items;
  }

  // get item by productId
  async getItem(userId: string, productId: string): Promise<any> {
    if (!(await this.productExists(productId))) return;

    const cartKey = this.getCartKey(userId);
    const itemData = await this.redisClient.hget(cartKey, productId);
    if (!itemData) {
      throw new NotFoundException(`Item with productId ${productId} not found`);
    }
    return JSON.parse(itemData);
  }

  // remove item from cart
  async removeItem(userId: string, productId: string): Promise<void> {
    if (!(await this.productExists(productId))) return;

    const cartKey = this.getCartKey(userId);
    // remove item from redis
    // check if item exists
    const itemData = await this.redisClient.hget(cartKey, productId);
    if (!itemData) {
      throw new NotFoundException(`Item with productId ${productId} not found`);
    }
    await this.redisClient.hdel(cartKey, productId);
  }

  // clear cart
  async clearCart(userId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    await this.redisClient.del(cartKey);
  }
}
