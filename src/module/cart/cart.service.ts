// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import Redis from 'ioredis';

@Injectable()
export class CartService {
  private redisClient: Redis;

  constructor(private redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  // add or update item in cart
  async addOrUpdateItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    // save item to redis
    const itemData = JSON.stringify({ productId, quantity });
    await this.redisClient.hset(this.getCartKey(userId), productId, itemData);
  }

  // get all items in cart
  async getCart(userId: string): Promise<any[]> {
    const cartKey = this.getCartKey(userId);
    const entries = await this.redisClient.hgetall(cartKey);
    console.log(entries);

    // convert object to array
    const items = Object.values(entries).map((data) => JSON.parse(data));
    return items;
  }

  // get item by productId
  async getItem(userId: string, productId: string): Promise<any> {
    const data = await this.redisClient.hget(
      this.getCartKey(userId),
      productId,
    );
    return data ? JSON.parse(data) : null;
  }

  // remove item from cart
  async removeItem(userId: string, productId: string): Promise<void> {
    await this.redisClient.hdel(this.getCartKey(userId), productId);
  }

  // clear cart
  async clearCart(userId: string): Promise<void> {
    await this.redisClient.del(this.getCartKey(userId));
  }
}
