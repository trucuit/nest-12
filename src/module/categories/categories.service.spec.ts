import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<CategoriesEntity>;

  const mockCategory = {
    id: 'd0b3b3b3-0b3b-4b3b-8b3b-0b3b3b3b3b3b',
    name: 'Test Category',
    description: 'Test Description',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoriesEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<CategoriesEntity>>(
      getRepositoryToken(CategoriesEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      mockRepository.create.mockReturnValue(mockCategory);
      mockRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(mockCategory);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return array of categories', async () => {
      mockRepository.find.mockResolvedValue([mockCategory]);

      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(mockCategory.id);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue({
        ...mockCategory,
        name: 'Updated Category',
      });

      const result = await service.update(mockCategory.id, {
        name: 'Updated Category',
      });

      expect(result.name).toBe('Updated Category');
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(mockCategory.id);
      expect(result).toBe(true);
    });
  });
});
