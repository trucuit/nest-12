import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoriesEntity>;
  let cacheManager: any;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockCategoryRepository = {
    findOne: jest.fn(),
  };

  const mockCacheManager = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(CategoriesEntity),
          useValue: mockCategoryRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(ProductEntity));
    categoryRepository = module.get(getRepositoryToken(CategoriesEntity));
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const productDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        categoryId: '1',
      };
      const category = { id: '1', name: 'Test Category' };
      const createdProduct = { ...productDto, category };

      mockCategoryRepository.findOne.mockResolvedValue(category);
      mockProductRepository.create.mockReturnValue(createdProduct);
      mockProductRepository.save.mockResolvedValue(createdProduct);

      const result = await service.createProduct(productDto);
      expect(result).toEqual(createdProduct);
    });

    it('should throw NotFoundException when category not found', async () => {
      const productDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        categoryId: '1',
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.createProduct(productDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const products = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];
      mockProductRepository.findAndCount.mockResolvedValue([products, 2]);

      const result = await service.getProducts(1, 10);
      expect(result).toEqual({
        data: products,
        total: 2,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const product = { id: '1', name: 'Product 1' };
      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await service.getProduct('1');
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.getProduct('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const productDto = {
        name: 'Updated Product',
        price: 200,
        description: 'Updated Description',
        categoryId: '1',
      };
      const category = { id: '1', name: 'Test Category' };
      const updatedProduct = { ...productDto, category };

      mockCategoryRepository.findOne.mockResolvedValue(category);
      mockProductRepository.create.mockReturnValue(updatedProduct);
      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      mockProductRepository.findOne.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct('1', productDto);
      expect(result).toEqual(updatedProduct);
      expect(cacheManager.del).toHaveBeenCalledWith('products');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteProduct('1');
      expect(mockProductRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteProduct('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIds', () => {
    it('should return products by ids', async () => {
      const products = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];
      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findByIds(['1', '2']);
      expect(result).toEqual(products);
    });

    it('should throw NotFoundException when no products found', async () => {
      mockProductRepository.find.mockResolvedValue([]);

      await expect(service.findByIds(['1', '2'])).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
