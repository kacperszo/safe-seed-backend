import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatroomsService } from 'src/chatrooms/chatrooms.service';
import { TagsService } from 'src/tags/tags.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SimilarUserDto } from './dtos/similar-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatromService: ChatroomsService,
    private readonly tagService: TagsService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
    type: UserDto,
  })
  @Post()
  @HttpCode(201)
  async create(@Body() reqBody: CreateUserDto) {
    const user = new User();

    user.phone = reqBody.phone;
    user.password = await hash(reqBody.password, 10);
    user.active = false;
    user.nickname = this.usersService.generateNickname();
    user.type = reqBody.type;
    user.bio = reqBody.bio;

    if (reqBody.tags)
      user.tags = await this.tagService.findTagsByIds(reqBody.tags);

    const createdUser = await this.usersService.create(user);

    return {
      id: createdUser.id,
      nickname: createdUser.nickname,
      type: createdUser.type,
      bio: createdUser.bio,
      tags: createdUser.tags,
    };
  }
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: UserDto,
  })
  async update(
    @Request() req,
    @Body() reqBody: UpdateUserDto,
    @Param('id') id: string,
  ) {
    const user = await this.usersService.findOneById(id);

    if (reqBody.tags) {
      user.tags = await this.tagService.findTagsByIds(reqBody.tags);
    }
    if (reqBody.bio) user.bio = reqBody.bio;
    if (user.id !== req.user.id)
      throw new ForbiddenException("You can't edit this user");
    const updatedUser = await this.usersService.update(user);

    return {
      id: updatedUser.id,
      nickname: updatedUser.nickname,
      type: updatedUser.type,
      bio: updatedUser.bio,
      tags: updatedUser.tags,
    };
  }

  @Get('regenerate-nickname')
  @ApiResponse({
    type: UserDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async regenerateNickname(@Request() req) {
    const user = await this.usersService.findOneById(req.user.id);
    user.nickname = this.usersService.generateNickname();
    const updatedUser = await this.usersService.update(user);

    return {
      id: updatedUser.id,
      nickname: updatedUser.nickname,
      type: updatedUser.type,
      bio: updatedUser.bio,
      tags: updatedUser.tags,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Returns all users with at least one similar tag',
    type: [SimilarUserDto],
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/similar')
  @HttpCode(200)
  async findUsersBySimilarity(@Request() req) {
    const user = await this.usersService.findOneById(req.user.id);
    const users = await this.usersService.findUsersBySimilarity(user);
    console.log(users);
    for (let i = 0; i < user.chatrooms.length; i++) {
      const chatroom = await this.chatromService.findOneByIdWithUsers(
        user.chatrooms[i].id,
      );
      for (let j = 0; j < chatroom.users.length; j++) {
        if (users.map((_user) => _user.id).includes(chatroom.users[j].id)) {
          users.splice(
            users.findIndex((_user) => _user.id === chatroom.users[j].id),
            1,
          );
        }
      }
    }

    return users;
  }

  @ApiResponse({
    status: 200,
    description: 'Returns users by type',
    type: [UserDto],
  })
  @Get(':type')
  @HttpCode(200)
  async findUsersByType(@Param('type') type: number) {
    console.log(this.usersService.findUsersByType(type));
    return this.usersService.findUsersByType(type);
  }
}
