import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToMany(() => User, (user) => user.chatrooms, {})
  @JoinTable({ name: 'chatroom_user' })
  users: User[];
  @OneToMany(() => Message, (message) => message.chatroom, { eager: true })
  messages: Message[];
  @Column({ default: true, type: 'boolean', nullable: true })
  active: boolean;
}
