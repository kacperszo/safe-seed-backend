import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MinLength } from 'class-validator';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  @MinLength(9)
  phone: string;
  @Column()
  nickname: string;
  @Column()
  @MinLength(8)
  password: string;
  @Column()
  type: number;
  @Column()
  active: boolean;
  @ManyToMany(() => Tag, (tag) => tag.users, { cascade: true, eager: true })
  tags: Tag[];
  @Column({ nullable: true })
  bio: string;
}
