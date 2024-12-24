import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../common/scoped/logger.service';
import { ProductDto } from '../../dto/product.dto';
import { ResponseData } from '../../global/globalClass';
import { HttpStatus } from '../../global/globalEnum';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    getProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return array of products', async () => {
      const result = {
        data: [new ProductEntity()],
        total: 1,
        page: 1,
        limit: 10,
      };
      mockProductService.getProducts.mockResolvedValue(result);

      const response = await controller.getProducts(1, 10);
      expect(response).toBeInstanceOf(ResponseData);
      expect(response.data).toEqual(result);
      expect(response.statusCode).toBe(HttpStatus.SUCCESS);
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const productDto: ProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        categoryId: 'test-category-id',
      };
      const product = new ProductEntity();
      mockProductService.createProduct.mockResolvedValue(product);

      const response = await controller.createProduct(productDto, null);
      expect(response).toBeInstanceOf(ResponseData);
      expect(response.statusCode).toBe(HttpStatus.SUCCESS);
    });
  });

  describe('getProduct', () => {
    it('should return a single product', async () => {
      const product = new ProductEntity();
      mockProductService.getProduct.mockResolvedValue(product);

      const response = await controller.getProduct('test-id');
      expect(response).toBeInstanceOf(ResponseData);
      expect(response.data).toEqual(product);
      expect(response.statusCode).toBe(HttpStatus.SUCCESS);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const productDto: ProductDto = {
        name: 'Updated Product',
        price: 200,
        description: 'Updated Description',
        categoryId: 'test-category-id',
      };
      const product = new ProductEntity();
      mockProductService.updateProduct.mockResolvedValue(product);

      const response = await controller.updateProduct('test-id', productDto);
      expect(response).toBeInstanceOf(ResponseData);
      expect(response.statusCode).toBe(HttpStatus.SUCCESS);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductService.deleteProduct.mockResolvedValue(true);

      const response = await controller.deleteProduct('test-id');
      expect(response).toBeInstanceOf(ResponseData);
      expect(response.data).toBe(true);
      expect(response.statusCode).toBe(HttpStatus.SUCCESS);
    });
  });
});
