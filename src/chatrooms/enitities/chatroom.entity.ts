import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @ManyToMany(() => User, (user) => user.chatrooms, {})
  @JoinTable({ name: 'chatroom_user' })
  users: User[];
  @ApiProperty()
  @OneToMany(() => Message, (message) => message.chatroom, { eager: true })
  messages: Message[];
  @ApiProperty()
  @Column({ default: true, type: 'boolean', nullable: true })
  active: boolean;
}
