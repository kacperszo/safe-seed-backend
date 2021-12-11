import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByPhone(phone);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }
  async login(user: User) {
    const payload = { id: user.id, nickname: user.nickname, type: user.type };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
