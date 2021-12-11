import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MinLength } from 'class-validator';
import { Tag } from './tag.entity';

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
  @ManyToMany(() => Tag, (tag) => tag.users)
  tags: Tag[];
  @Column({ nullable: true })
  bio: string;
}
