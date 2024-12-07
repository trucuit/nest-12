// src/cart/cart.controller.ts
import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateOrUpdateCartItemDto } from './dto/create-or-update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // hardcoded userId for now
  private userId = '123e4567-e89b-12d3-a456-426614174000';

  @Post('item')
  async addOrUpdateItem(@Body() dto: CreateOrUpdateCartItemDto) {
    await this.cartService.addOrUpdateItem(
      this.userId,
      dto.productId,
      dto.quantity,
    );
    return { message: 'Item added/updated successfully' };
  }

  @Get()
  async getCart() {
    const cart = await this.cartService.getCart(this.userId);
    return cart;
  }

  @Get(':productId')
  async getItem(@Param('productId') productId: string) {
    const item = await this.cartService.getItem(this.userId, productId);
    return item || { message: 'Item not found' };
  }

  @Delete(':productId')
  async removeItem(@Param('productId') productId: string) {
    await this.cartService.removeItem(this.userId, productId);
    return { message: 'Item removed successfully' };
  }

  @Delete()
  async clearCart() {
    await this.cartService.clearCart(this.userId);
    return { message: 'Cart cleared successfully' };
  }
}
