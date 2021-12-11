import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Chatroom } from './enitities/chatroom.entity';
import { Message } from './enitities/message.entity';

//chatroom service
@Injectable()
export class ChatroomsService {
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
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  async create(chatroom: Chatroom) {
    return this.chatroomRepository.save(chatroom);
  }
}
