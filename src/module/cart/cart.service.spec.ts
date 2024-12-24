import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from '../../redis/redis.service';
import { ProductEntity } from '../products/product.entity';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let redisService: RedisService;
  let mockRedisClient;
  let mockProductRepository;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
  };

  beforeEach(async () => {
    mockRedisClient = {
      hset: jest.fn(),
      hget: jest.fn(),
      hgetall: jest.fn(),
      hdel: jest.fn(),
      del: jest.fn(),
    };

    mockProductRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: RedisService,
          useValue: {
            getClient: () => mockRedisClient,
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('productExists', () => {
    it('should return true if product exists', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      const result = await service.productExists('1');
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.productExists('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addOrUpdateItem', () => {
    it('should add item to cart', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      await service.addOrUpdateItem('user1', '1', 2);
      expect(mockRedisClient.hset).toHaveBeenCalled();
    });
  });

  describe('getCart', () => {
    it('should return cart items with product details', async () => {
      const mockCartData = {
        '1': JSON.stringify({ productId: '1', quantity: 2 }),
      };
      mockRedisClient.hgetall.mockResolvedValue(mockCartData);
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.getCart('user1');
      expect(result).toEqual([
        { productId: '1', quantity: 2, product: mockProduct },
      ]);
    });
  });

  describe('getItem', () => {
    it('should return specific cart item', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      const mockItemData = JSON.stringify({ productId: '1', quantity: 2 });
      mockRedisClient.hget.mockResolvedValue(mockItemData);

      const result = await service.getItem('user1', '1');
      expect(result).toEqual({ productId: '1', quantity: 2 });
    });

    it('should throw NotFoundException if item not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockRedisClient.hget.mockResolvedValue(null);

      await expect(service.getItem('user1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockRedisClient.hget.mockResolvedValue(
        JSON.stringify({ productId: '1', quantity: 2 }),
      );

      await service.removeItem('user1', '1');
      expect(mockRedisClient.hdel).toHaveBeenCalled();
    });

    it('should throw NotFoundException if item not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockRedisClient.hget.mockResolvedValue(null);

      await expect(service.removeItem('user1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      await service.clearCart('user1');
      expect(mockRedisClient.del).toHaveBeenCalled();
    });
  });
});
