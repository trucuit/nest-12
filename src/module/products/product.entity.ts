import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  price: number;

  @Column({ nullable: true })
  image: string;

  // Audit Fields
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relationship with category
  @ManyToOne(() => CategoriesEntity, (category) => category.products, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoriesEntity;
}

/*
// payload create product
{
  "name": "Book 1",
  "description": "Book 1 description",
  "price": 100,
  "image": "https://example.com/book1.jpg",
  "category": "cdafe7f1-af58-4f3c-a4ee-0535f8e8ebda"
}

*/
