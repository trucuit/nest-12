// src/cart/cart.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntity } from '../users/user.entity';
import { CartService } from './cart.service';
import { CreateOrUpdateCartItemDto } from './dto/create-or-update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('item')
  async addOrUpdateItem(
    @GetUser() user: Pick<UserEntity, 'id'>,
    @Body() dto: CreateOrUpdateCartItemDto,
  ) {
    const userId = user.id;
    await this.cartService.addOrUpdateItem(userId, dto.productId, dto.quantity);
    return { message: 'Item added/updated successfully' };
  }

  @Get()
  async getCart(@GetUser() user: Pick<UserEntity, 'id'>) {
    const userId = user.id;
    const cart = await this.cartService.getCart(userId);
    return cart;
  }

  @Get(':productId')
  async getItem(
    @GetUser() user: Pick<UserEntity, 'id'>,
    @Param('productId') productId: string,
  ) {
    const item = await this.cartService.getItem(user.id, productId);
    return item || { message: 'Item not found' };
  }

  @Delete(':productId')
  async removeItem(
    @GetUser() user: Pick<UserEntity, 'id'>,
    @Param('productId') productId: string,
  ) {
    await this.cartService.removeItem(user.id, productId);
    return { message: 'Item removed successfully' };
  }

  @Delete()
  async clearCart(@GetUser() user: Pick<UserEntity, 'id'>) {
    await this.cartService.clearCart(user.id);
    return { message: 'Cart cleared successfully' };
  }
}
