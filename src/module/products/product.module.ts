import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from 'src/common/scoped/logger.service';
import { CacheService } from 'src/transient/cache.service';
import { CategoriesEntity } from '../categories/categories.entity';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoriesEntity])],
  controllers: [ProductController],
  providers: [ProductService, CacheService, LoggerService],
  exports: [ProductService],
})
export class ProductModule {}
