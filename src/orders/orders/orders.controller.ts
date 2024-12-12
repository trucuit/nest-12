// src/order/order.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/module/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/module/users/user.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { Order } from '../entities/order.entity';
import { OrderService } from './orders.service';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('confirm')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Confirm an order from cart' })
  @ApiResponse({
    status: 201,
    description: 'Order confirmed successfully.',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async confirmOrder(
    @GetUser() user: Pick<UserEntity, 'id'>,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = user.id;
    const order = await this.orderService.confirmOrder(userId, createOrderDto);
    return order;
  }

  @Get('history')
  @ApiOperation({ summary: 'Get order history of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of user orders.',
    type: [OrderResponseDto],
  })
  async getOrderHistory(
    @GetUser() user: Pick<UserEntity, 'id'>,
  ): Promise<Order[]> {
    const userId = user.id;
    const orders = await this.orderService.getOrderHistory(userId);
    return orders;
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get details of a specific order' })
  @ApiResponse({
    status: 200,
    description: 'Order details.',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrderById(
    @GetUser() user: Pick<UserEntity, 'id'>,
    @Param('orderId') orderId: string,
  ): Promise<Order> {
    const userId = user.id;
    const order = await this.orderService.getOrderById(userId, orderId);
    return order;
  }
}
