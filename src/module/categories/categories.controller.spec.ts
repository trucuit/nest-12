import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = {
    id: 'd0b3b3b3-0b3b-4b3b-8b3b-0b3b3b3b3b3b',
    name: 'Test Category',
    description: 'Test Description',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategoriesService = {
    create: jest.fn().mockResolvedValue(mockCategory),
    findAll: jest.fn().mockResolvedValue([mockCategory]),
    findOne: jest.fn().mockResolvedValue(mockCategory),
    update: jest.fn().mockResolvedValue(mockCategory),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };
      expect(await controller.createCategory(dto)).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return array of categories', async () => {
      expect(await controller.findAll()).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const id = 'd0b3b3b3-0b3b-4b3b-8b3b-0b3b3b3b3b3b';
      expect(await controller.findOne(id)).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id = 'd0b3b3b3-0b3b-4b3b-8b3b-0b3b3b3b3b3b';
      const dto: CreateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };
      expect(await controller.update(id, dto)).toEqual(mockCategory);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = 'd0b3b3b3-0b3b-4b3b-8b3b-0b3b3b3b3b3b';
      expect(await controller.remove(id)).toEqual(true);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
