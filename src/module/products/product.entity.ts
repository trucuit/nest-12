import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  categoryId: number;

  @Column()
  productName: string;

  @Column()
  price: number;
}
