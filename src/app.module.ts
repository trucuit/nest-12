import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './module/auth/auth.module';
import { CategoriesModule } from './module/categories/categories.module';
import { ProductEntity } from './module/products/product.entity';
import { ProductModule } from './module/products/product.module';
import { UserEntity } from './module/users/user.entity';
import { UsersModule } from './module/users/users.module';
import { CategoriesEntity } from './module/categories/categories.entity';

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
    ProductModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
