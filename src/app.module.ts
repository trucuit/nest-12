import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './module/auth/auth.module';
import { CartModule } from './module/cart/cart.module';
import { CategoriesEntity } from './module/categories/categories.entity';
import { CategoriesModule } from './module/categories/categories.module';
import { ProductEntity } from './module/products/product.entity';
import { ProductModule } from './module/products/product.module';
import { UserEntity } from './module/users/user.entity';
import { UsersModule } from './module/users/users.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule global
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Hoặc database bạn đang sử dụng
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '123123',
      database: process.env.DATABASE_NAME || 'posts',
      entities: [UserEntity, ProductEntity, CategoriesEntity],
      synchronize: true, // only use in development
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600, // TTL mặc định cho cache (600 giây)
      max: 100, // Tối đa 100 phần tử trong cache
    }),
    ProductModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    RedisModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
