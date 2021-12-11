import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

class LoginResponse {
  @ApiProperty()
  token: string;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
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
    return this.authService.login(req.user);
  }
}
