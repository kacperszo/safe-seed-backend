import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    const createdUser = await this.usersService.create(user);

    return {
      id: createdUser.id,
      phone: createdUser.phone,
      nickname: createdUser.nickname,
      type: createdUser.type,
      bio: createdUser.bio,
    };
  }
}
