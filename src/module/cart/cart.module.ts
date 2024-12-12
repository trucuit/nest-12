import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RedisModule } from 'src/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]), // Import TypeOrmModule and include ProductEntity
    RedisModule,
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
