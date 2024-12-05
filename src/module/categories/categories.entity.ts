import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // Audit Fields
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => CategoriesEntity, (category) => category.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: CategoriesEntity;
}

// •	id: Khóa chính tự động tạo UUID.
// •	name: Tên của category, không được để trống và có độ dài tối đa là 100 ký tự.
// •	description: Mô tả về category, có thể để trống.
// •	createdAt & updatedAt: Các trường audit để theo dõi thời gian tạo và cập nhật.
// •	parentId: UUID của parent category để tạo cấu trúc phân cấp. Có thể để trống nếu category là cấp cao nhất.
// •	parent: Quan hệ Many-to-One với Category để dễ dàng truy vấn parent category.
