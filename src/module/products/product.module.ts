import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { LoggerService } from 'src/common/scoped/logger.service';
import { CacheService } from 'src/transient/cache.service';
import { CategoriesEntity } from '../categories/categories.entity';
import { Cache } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoriesEntity])],
  controllers: [ProductController],
  providers: [ProductService, CacheService, LoggerService],
})
export class ProductModule {}
