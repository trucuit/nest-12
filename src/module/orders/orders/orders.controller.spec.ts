import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
  };

  const mockOrder: Partial<Order> = {
    id: '1',
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderService = {
    confirmOrder: jest.fn(),
    getOrderHistory: jest.fn(),
    getOrderById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('confirmOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: '1',
            quantity: 2,
            productName: 'Test Product',
            price: 50,
          },
        ],
        address: '123 Test Street',
        phoneNumber: '1234567890',
      };

      mockOrderService.confirmOrder.mockResolvedValue(mockOrder);

      const result = await controller.confirmOrder(mockUser, createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(service.confirmOrder).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
        createOrderDto,
      );
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history', async () => {
      mockOrderService.getOrderHistory.mockResolvedValue([mockOrder]);

      const result = await controller.getOrderHistory(mockUser);

      expect(result).toEqual([mockOrder]);
      expect(service.getOrderHistory).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('getOrderById', () => {
    it('should return specific order', async () => {
      const orderId = '1';
      mockOrderService.getOrderById.mockResolvedValue(mockOrder);

      const result = await controller.getOrderById(mockUser, orderId);

      expect(result).toEqual(mockOrder);
      expect(service.getOrderById).toHaveBeenCalledWith(mockUser.id, orderId);
    });
  });
});
