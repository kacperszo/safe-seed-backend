import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Chatroom } from './enitities/chatroom.entity';
import { Message } from './enitities/message.entity';

//chatroom service
@Injectable()
export class ChatroomsService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UsersService,
  ) {}

  async addMessage(chatroomId: any, userId: any, message: any) {
    const chatroom = await this.chatroomRepository.findOne(chatroomId);
    const user = await this.userService.findOneById(userId);
    const newMessage = new Message();
    newMessage.chatroom = chatroom;
    newMessage.author = user;
    newMessage.message = message;
    return this.messageRepository.save(newMessage);
  }
  async findOneById(id: any) {
    return this.chatroomRepository.findOne(id);
  }
  async findOneByIdWithUsers(id: any) {
    return this.chatroomRepository
      .createQueryBuilder('chatroom')
      .leftJoinAndSelect('chatroom.users', 'users')
      .where('chatroom.id = :id', { id })
      .getOne();
  }

  async create(chatroom: Chatroom) {
    return this.chatroomRepository.save(chatroom);
  }

  async leave(chatroom: Chatroom, user: User) {
    chatroom.users.splice(chatroom.users.indexOf(user), 1);
    return this.chatroomRepository.save(chatroom);
  }

  async getAllMessagesFromChatroom(id: string) {
    return this.messageRepository
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.author', 'user')
    .where('"chatroomId" = :id', { id })
    .getMany();
  }
}