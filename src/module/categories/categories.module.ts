import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoryRepository } from './category.repository';
import { TransientModule } from 'src/transient/transient.module';

// TODO: why use Scope.TRANSIENT in TransientModule?
@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesEntity, CategoryRepository]),
    TransientModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
