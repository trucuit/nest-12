import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(data: Partial<CategoriesEntity>): Promise<CategoriesEntity> {
    const category = this.categoriesRepository.create(data);
    return this.categoriesRepository.save(category);
  }

  // get all categories
  async findAll(): Promise<CategoriesEntity[]> {
    return this.categoriesRepository.find({
      relations: ['parent'], // Load parent category
    });
  }

  // get category by id
  async findOne(id: string): Promise<CategoriesEntity> {
    const result = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent'], // Load parent category
    });
    console.log('result', result);

    if (!result) {
      throw new NotFoundException(`result with ID ${id} not found`);
    }
    return result;
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
