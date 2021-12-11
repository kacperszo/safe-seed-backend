import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.messages)
  author: User;
  @ApiProperty()
  @Column()
  message: string;
  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => Chatroom, (chatroom) => chatroom.messages)
  chatroom: Chatroom;
}
