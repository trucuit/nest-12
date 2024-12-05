import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  // create a new category
  // TODO: should use CreateCategoryDto instead of Partial<CategoriesEntity>?
  async create(data: Partial<CategoriesEntity>): Promise<CategoriesEntity> {
    const category = this.categoriesRepository.create(data);
    return this.categoriesRepository.save(category);
  }

  // TODO: what is "Load parent category?"
  // get all categories
  async findAll(): Promise<CategoriesEntity[]> {
    return this.categoriesRepository.find({
      relations: ['parent'], // Load parent category
    });
  }

  // get category by id
  async findOne(id: string): Promise<CategoriesEntity> {
    return this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent'], // Load parent category
    });
  }

  async update(
    id: string,
    data: Partial<CategoriesEntity>,
  ): Promise<CategoriesEntity> {
    await this.categoriesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    await this.categoriesRepository.delete(id);
    return true;
  }
}
