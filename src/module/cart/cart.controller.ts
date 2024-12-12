// src/cart/cart.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { CreateOrUpdateCartItemDto } from './dto/create-or-update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // hardcoded userId for now
  private userId = '';

  @Post('item')
  async addOrUpdateItem(
    @Req() request: Request,
    @Body() dto: CreateOrUpdateCartItemDto,
  ) {
    this.userId = (request as any).user?.userId;

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
  async getItem(
    @Req() request: Request,
    @Param('productId') productId: string,
  ) {
    this.userId = (request as any).user?.userId;
    const item = await this.cartService.getItem(this.userId, productId);
    return item || { message: 'Item not found' };
  }

  @Delete(':productId')
  async removeItem(
    @Req() request: Request,
    @Param('productId') productId: string,
  ) {
    this.userId = (request as any).user?.userId;
    await this.cartService.removeItem(this.userId, productId);
    return { message: 'Item removed successfully' };
  }

  @Delete()
  async clearCart(@Req() request: Request) {
    this.userId = (request as any).user?.userId;

    await this.cartService.clearCart(this.userId);
    return { message: 'Cart cleared successfully' };
  }
}
