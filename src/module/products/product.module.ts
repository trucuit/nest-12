import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { LoggerService } from 'src/common/scoped/logger.service';
import { CacheService } from 'src/transient/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService, CacheService, LoggerService],
})
export class ProductModule {}
