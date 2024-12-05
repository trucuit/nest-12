// src/categories/category.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { CategoriesEntity } from './categories.entity';

@EntityRepository(CategoriesEntity)
export class CategoryRepository extends Repository<CategoriesEntity> {
  // find category by name
  async findByName(name: string): Promise<CategoriesEntity[]> {
    return this.find({
      where: { name },
      relations: ['parent'],
    });
  }
}
