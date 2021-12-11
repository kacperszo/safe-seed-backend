import {
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
import { TagsService } from 'src/tags/tags.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindUserDto } from './dtos/find-users.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
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
    user.tags = await this.tagService.findTagsByIds(reqBody.tags);

    const createdUser = await this.usersService.create(user);

    return {
      id: createdUser.id,
      phone: createdUser.phone,
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
    @Param('id') id: number,
  ) {
    const user = await this.usersService.findOneById(id);
    if (user.id !== req.user.id)
      throw new ForbiddenException("You can't edit this user");
    user.bio = reqBody.bio;
    user.tags = await this.tagService.findTagsByIds(reqBody.tags);
    const updatedUser = await this.usersService.update(user);

    return {
      id: updatedUser.id,
      phone: updatedUser.phone,
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
      phone: updatedUser.phone,
      nickname: updatedUser.nickname,
      type: updatedUser.type,
      bio: updatedUser.bio,
      tags: updatedUser.tags,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Returns all users with at least one similar tag',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/similar')
  @HttpCode(200)
  async findAllBySimilarity(@Request() req) {
    return this.usersService.findAllBySimilarity(req.user.id);
  }
}
