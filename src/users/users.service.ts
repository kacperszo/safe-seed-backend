import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  generateNickname(): string {
    const adjectives = [
      'adorable',
      'beautiful',
      'clean',
      'colorful',
      'elegant',
      'fancy',
      'glamorous',
      'handsome',
      'awesome',
      'magnificent',
      'old-fashioned',
      'funny',
      'great',
      'mysterious',
      'beautiful',
      'cool',
      'interesting',
      'neat',
      'cute',
      'special',
    ];
    const nouns = [
      'friend',
      'pal',
      'fan',
      'buddy',
      'soulmate',
      'mate',
      'sweetheart',
      'person',
      'someone',
      'hero',
      'genius',
      'superstar',
      'superhero',
      'scientist',
      'specialist',
      'brain',
      'leader',
    ];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      nouns[Math.floor(Math.random() * nouns.length)]
    }`;
  }
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
  async findOneByPhone(phone: string): Promise<User> {
    return this.userRepository.findOne({ where: { phone } });
  }
  async create(user: User): Promise<User> {
    if (await this.findOneByPhone(user.phone)) {
      throw new BadRequestException('User with this phone already exists');
    }
    return this.userRepository.save(user);
  }
  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
