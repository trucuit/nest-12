import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from 'src/dto/product.dto';
import { Product } from 'src/models/product.model';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from 'src/transient/cache.service';
import { CategoriesEntity } from '../categories/categories.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
    private readonly cacheService: CacheService,
  ) {}

  // create product
  /**
   * example:
   * {
   *  "name": "product 1",
   *  "price": 1000,
   *  "description": "description 1"
   * }
   * @param productDto
   * @returns
   */
  async createProduct(productDto: ProductDto): Promise<Product> {
    const category = await this.categoriesRepository.findOne({
      where: { id: productDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${productDto.categoryId} not found`,
      );
    }

    const model = this.productRepository.create({
      ...productDto,
      category,
    }); // this line: convert dto to entity
    return await this.productRepository.save(model);
  }

  // get all products
  async getProducts(): Promise<Product[]> {
    let cacheData = this.cacheService.get('products');
    if (cacheData) {
      return cacheData;
    }
    cacheData = await this.productRepository.find();
    this.cacheService.set('products', cacheData);
    return cacheData;
  }

  // get product by id
  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } }); // this line: get entity by id
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // update product
  async updateProduct(id: string, productDto: ProductDto): Promise<Product> {
    let updatedProductDto = { ...productDto };
    if (productDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: productDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${productDto.categoryId} not found`,
        );
      }
      updatedProductDto = { ...productDto, categoryId: category.id };
    }
    await this.productRepository.update(id, updatedProductDto);
    return this.getProduct(id);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = this.productRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
