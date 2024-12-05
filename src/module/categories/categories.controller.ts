import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from './categories.entity';
import { CreateCategoryDto } from 'src/dto/create-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoriesEntity> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<CategoriesEntity[]> {
    return this.categoriesService.findAll();
  }

  // get category by id
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CategoriesEntity> {
    return this.categoriesService.findOne(id);
  }

  // update category by id
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<CategoriesEntity> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // remove category by id
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.categoriesService.remove(id);
  }
}
