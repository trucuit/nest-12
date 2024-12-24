import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailQueueService } from '../../../mail-queue/mail-queue.service';
import { RedisService } from '../../../redis/redis.service';
import { ProductService } from '../../products/product.service';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { OrderService } from './orders.service';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRedisClient = {
    del: jest.fn().mockResolvedValue(true),
  };

  const mockRedisService = {
    getClient: jest.fn().mockReturnValue(mockRedisClient),
  };

  const mockProductService = {
    findByIds: jest.fn(),
  };

  const mockMailQueueService = {
    addToQueue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: MailQueueService,
          useValue: mockMailQueueService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('confirmOrder', () => {
    const mockOrderDto = {
      address: 'Test Address',
      phoneNumber: '1234567890',
      items: [
        {
          productId: '1',
          quantity: 2,
          productName: 'Test Product',
          price: 100,
        },
      ],
    };

    const mockProduct = {
      id: '1',
      price: 100,
    };

    it('should create order successfully', async () => {
      mockProductService.findByIds.mockResolvedValue([mockProduct]);
      mockOrderRepository.create.mockReturnValue({ items: [] });
      mockOrderRepository.save.mockResolvedValue({ id: '1' });

      const result = await service.confirmOrder(
        'user1',
        'test@test.com',
        mockOrderDto,
      );

      expect(result).toBeDefined();
      expect(mockRedisClient.del).toHaveBeenCalled();
      expect(mockMailQueueService.addToQueue).toHaveBeenCalled();
    });

    it('should throw BadRequestException for empty cart', async () => {
      await expect(
        service.confirmOrder('user1', 'test@test.com', {
          ...mockOrderDto,
          items: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history', async () => {
      const mockOrders = [{ id: '1' }];
      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getOrderHistory('user1');

      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('should return order when found', async () => {
      const mockOrder = { id: '1' };
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.getOrderById('user1', '1');

      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.getOrderById('user1', '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
