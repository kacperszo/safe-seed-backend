import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from './chatroom.entity';

//message entity
@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToMany(() => User, (user) => user.messages)
  author: User;
  @Column()
  message: string;
  @Column({ type: 'timestamp' })
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.messages)
  chatroom: Chatroom;
}
