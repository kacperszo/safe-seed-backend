import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TagType {
  PROBLEM = 'problem',
  GOAL = 'goal',
}
@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @ManyToMany(() => User, (user) => user.tags)
  @JoinTable({
    name: 'user_tag',
  })
  users: User[];
  @Column({ type: 'enum', enum: TagType, default: TagType.PROBLEM })
  type: TagType;
}
