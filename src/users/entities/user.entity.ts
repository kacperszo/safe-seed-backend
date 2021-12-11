import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MinLength } from 'class-validator';
import { Tag } from '../../tags/entities/tag.entity';
import { Chatroom } from 'src/chatrooms/enitities/chatroom.entity';
import { Message } from 'src/chatrooms/enitities/message.entity';

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
  @ManyToMany(() => Chatroom, (chatroom) => chatroom.users, {
    lazy: true,
  })
  chatrooms: Chatroom[];
  @Column({ nullable: true })
  bio: string;
  @OneToMany(() => Message, (message) => message.author, { lazy: true })
  messages: Message[];
}
