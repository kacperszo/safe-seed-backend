import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
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

  async findAllBySimilarity(id: string): Promise<User[]> {
    // select "user"."id", (
    //   select count(*)
    //   from (
    //     select count("userId"), "tagId"
    //     from (
    //       select *
    //       from "user_tag"
    //       where "userId" = '6303ad9d-f9a2-40af-8570-85bb139f1d87' or "userId" = "user"."id"
    //     )
    //     as k2
    //     group by "tagId"
    //     having count("userId") > 1
    //   )
    //   as k2
    // )
    // from "user";

    const q1 = (id?: string): SelectQueryBuilder<unknown> => {
      const query = this.userRepository.manager
        .createQueryBuilder()
        .select('*')
        .from('user_tag', 'q1')
        .orWhere('"userId" = "user"."id"');

      if (id) {
        query.orWhere('"userId" = :userId', { userId: id });
      }

      return query;
    };

    const q2 = (id?: string): SelectQueryBuilder<unknown> => {
      return this.userRepository.manager
        .createQueryBuilder()
        .select('count("userId")')
        .from(
          `(${(([sql, params] = q1(id).getQueryAndParameters()) =>
            sql.replace('$1', `'${params[0]}'`))()})`,
          'q1',
        )
        .groupBy('"tagId"')
        .having('count("userId") > 1');
    };

    const q3 = (id?: string): SelectQueryBuilder<unknown> => {
      return this.userRepository.manager
        .createQueryBuilder()
        .select('count(*)')
        .from(`(${q2(id).getQuery()})`, 'q2');
    };

    const q4 = (id?: string) => {
      return this.userRepository.manager
        .createQueryBuilder()
        .select('"user"."id"')
        .addSelect(`(${q3(id).getQuery()})`, 'count')
        .from(User, 'user');
    };

    return this.userRepository.manager
      .createQueryBuilder()
      .select('*')
      .from(`(${q4(id).getQuery()})`, 'q4')
      .where('"count" > 0')
      .getRawMany();
  }
}
