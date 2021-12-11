import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ChatroomsService } from './chatrooms.service';
import { Chatroom } from './enitities/chatroom.entity';

//chatrooms controller
@Controller('chatrooms')
export class ChatroomsController {
  constructor(
    private readonly chatromService: ChatroomsService,
    private readonly userService: UsersService,
  ) {}
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
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    return (await this.userService.findOneById(req.user.id)).chatrooms;
  }
  @Post(':roomId/leave')
  leave() {
    return null;
  }
  @Get(':roomId')
  getRoom() {
    return null;
  }
}
