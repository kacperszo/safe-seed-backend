import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ChatroomsController } from './chatrooms.controller';
import { ChatroomsService } from './chatrooms.service';
import { Chatroom } from './enitities/chatroom.entity';
import { Message } from './enitities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatroom]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [ChatroomsService],
  controllers: [ChatroomsController],
  exports: [TypeOrmModule, ChatroomsModule],
})
export class ChatroomsModule {}
