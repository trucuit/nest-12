import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailQueueModule } from './mail-queue/mail-queue.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './module/auth/auth.module';
import { CartModule } from './module/cart/cart.module';
import { CategoriesEntity } from './module/categories/categories.entity';
import { CategoriesModule } from './module/categories/categories.module';
import { FileController } from './module/file/file.controller';
import { ProductEntity } from './module/products/product.entity';
import { ProductModule } from './module/products/product.module';
import { UserEntity } from './module/users/user.entity';
import { UsersModule } from './module/users/users.module';
import { OrderItem } from './orders/entities/order-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule global
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from `uploads` directory
      serveRoot: '/uploads', // Map to `/uploads` in the URL
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Hoặc database bạn đang sử dụng
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '123123',
      database: process.env.DATABASE_NAME || 'posts',
      entities: [UserEntity, ProductEntity, CategoriesEntity, Order, OrderItem],
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
    ScheduleModule.forRoot(),
    ProductModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    RedisModule,
    CartModule,
    OrdersModule,
    MailQueueModule,
  ],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
