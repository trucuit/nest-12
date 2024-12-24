import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateOrUpdateCartItemDto } from './dto/create-or-update-cart-item.dto';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  const mockCartService = {
    addOrUpdateItem: jest.fn(),
    getCart: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
  };

  const mockUser = { id: 'user-123' };
  const mockProductId = 'product-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addOrUpdateItem', () => {
    it('should add or update cart item successfully', async () => {
      const dto: CreateOrUpdateCartItemDto = {
        productId: mockProductId,
        quantity: 2,
      };

      await controller.addOrUpdateItem(mockUser, dto);

      expect(cartService.addOrUpdateItem).toHaveBeenCalledWith(
        mockUser.id,
        dto.productId,
        dto.quantity,
      );
    });
  });

  describe('getCart', () => {
    it('should return user cart', async () => {
      const mockCart = [{ productId: mockProductId, quantity: 1 }];
      mockCartService.getCart.mockResolvedValue(mockCart);

      const result = await controller.getCart(mockUser);

      expect(cartService.getCart).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockCart);
    });
  });

  describe('getItem', () => {
    it('should return cart item if found', async () => {
      const mockItem = { productId: mockProductId, quantity: 1 };
      mockCartService.getItem.mockResolvedValue(mockItem);

      const result = await controller.getItem(mockUser, mockProductId);

      expect(cartService.getItem).toHaveBeenCalledWith(
        mockUser.id,
        mockProductId,
      );
      expect(result).toEqual(mockItem);
    });

    it('should return not found message if item does not exist', async () => {
      mockCartService.getItem.mockResolvedValue(null);

      const result = await controller.getItem(mockUser, mockProductId);

      expect(cartService.getItem).toHaveBeenCalledWith(
        mockUser.id,
        mockProductId,
      );

      expect(result).toEqual({ message: 'Item not found' });
    });
  });

  describe('removeItem', () => {
    it('should remove cart item successfully', async () => {
      await controller.removeItem(mockUser, mockProductId);

      expect(cartService.removeItem).toHaveBeenCalledWith(
        mockUser.id,
        mockProductId,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear user cart', async () => {
      await controller.clearCart(mockUser);

      expect(cartService.clearCart).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
