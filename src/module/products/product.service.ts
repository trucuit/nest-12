import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from 'src/dto/product.dto';
import { Product } from 'src/models/product.model';
import { In, Repository } from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { ProductEntity } from './product.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
  async getProducts(
    page: number,
    limit: number,
  ): Promise<{
    data: ProductEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    // let cacheData = await this.cacheService.get<Product[]>('products');
    // if (cacheData) {
    //   return cacheData;
    // }
    // cacheData = await this.productRepository.find();
    // this.cacheService.set('products', cacheData);
    // return cacheData;

    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
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
    });

    const result = await this.productRepository.update(id, model);
    if (!result.affected) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // clear cache
    await this.cacheService.del('products');
    return await this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('Không tìm thấy sản phẩm nào.');
    }

    return products;
  }
}
