import { Controller, UseGuards, Request, Post, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

class LoginResponse {
  @ApiProperty()
  token: string;
  @ApiProperty()
  user: UserDto;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    schema: {
      properties: {
        phone: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login to get token',
    type: LoginResponse,
  })
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    const { password, ...rest } = await this.userService.findOneById(
      req.user.id,
    );
    return {
      ...token,
      user: rest,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto })
  async me(@Request() req) {
    const { password, ...rest } = await this.userService.findOneById(
      req.user.id,
    );

    return rest;
  }
}
