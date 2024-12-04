import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from 'src/dto/product.dto';
import { Product } from 'src/models/product.model';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from 'src/transient/cache.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getProducts(): Promise<Product[]> {
    let cacheData = this.cacheService.get('products');
    if (cacheData) {
      return cacheData;
    }
    cacheData = await this.productRepository.find();
    this.cacheService.set('products', cacheData);
    return cacheData;
  }

  async createProduct(productDto: ProductDto): Promise<Product> {
    const model = this.productRepository.create(productDto); // this line: convert dto to entity
    const savedEntity = await this.productRepository.save({
      ...model,
      id: uuidv4(),
    });
    return savedEntity;
  }

  async getProduct(id: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } }); // this line: get entity by id
  }

  async updateProduct(productDto: ProductDto): Promise<Product> {
    // Find the user to update
    const user = await this.productRepository.findOne({
      where: { id: productDto.id },
    });

    // Check if user exists
    if (!user) {
      throw new NotFoundException(`User with ID ${productDto.id} not found`);
    }

    // Update the user's properties
    Object.assign(user, productDto); // Simple update, handles partial updates

    // Save the updated user
    return await this.productRepository.save(user);
  }

  deleteProduct(id: string): boolean {
    this.productRepository.delete(id);
    return true;
  }
}
