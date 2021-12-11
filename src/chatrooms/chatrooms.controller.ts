import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChatroomsService } from './chatrooms.service';
import { Chatroom } from './enitities/chatroom.entity';
import { Message } from './enitities/message.entity';

//chatrooms controller
@ApiTags('Chat rooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(
    private readonly chatromService: ChatroomsService,
    private readonly userService: UsersService,
  ) {}
  @ApiResponse({
    status: 201,
    description: 'Creates new Chatroom',
    type: [Message],
  })
  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Param('userId') userId: string) {
    const chatroom = new Chatroom();
    const user = await this.userService.findOneById(req.user.id);
    for (let i = 0; i < user.chatrooms.length; i++) {
      const chatroom = await this.chatromService.findOneByIdWithUsers(
        user.chatrooms[i].id,
      );

      for (let j = 0; j < chatroom.users.length; j++) {
        if (chatroom.users[j].id === userId) {
          throw new BadRequestException(
            'you cannot create a conversation with the same user twice',
          );
        }
      }
    }

    chatroom.users = [user, await this.userService.findOneById(userId)];

    return this.chatromService.create(chatroom);
  }
  @ApiResponse({
    status: 200,
    description: 'Returns all chatrooms',
    type: [Chatroom],
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    return Promise.all(
      (await this.userService.findOneById(req.user.id)).chatrooms.map(
        async (_chatroom) => {
          const chatroom = await this.chatromService.findOneByIdWithUsers(
            _chatroom.id,
          );
          chatroom.users = [
            chatroom.users.find((user) => user.id !== req.user.id),
          ];
          return chatroom;
        },
      ),
    );
  }
  @ApiResponse({
    status: 200,
    description: 'Leaves chatroom',
  })
  @Post(':roomId/leave')
  @UseGuards(JwtAuthGuard)
  async leave(@Param('roomId') roomId: string, @Request() req) {
    const chatroom = await this.chatromService.findOneByIdWithUsers(roomId);
    const user = await this.userService.findOneById(req.user.id);
    return this.chatromService.leave(chatroom, user);
  }
  @ApiResponse({
    status: 200,
    description: 'Returns all messages from channel',
    type: [Message],
  })
  @Get(':roomId')
  @UseGuards(JwtAuthGuard)
  async getRoomMsg(@Request() req, @Param('roomId') roomId: string) {
    const user = await this.userService.findOneById(req.user.id);
    let userisPartOfRoom = false;
    for (let i = 0; i < user.chatrooms.length; i++) {
      if (user.chatrooms[i].id === roomId) {
        userisPartOfRoom = true;
      }
    }
    if (!userisPartOfRoom) {
      throw new BadRequestException('you are not part of this room');
    }
    return (await this.chatromService.getAllMessagesFromChatroom(roomId));
  }
}
