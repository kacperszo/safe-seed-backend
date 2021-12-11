import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from 'src/tags/dtos/tag.dto';
import { Tag } from 'src/tags/entities/tag.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { SimilarUserDto } from './dtos/similar-user.dto';
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
  async findOneById(id: string): Promise<User> {
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

  async findUsersBySimilarity(user: User): Promise<SimilarUserDto[]> {
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

    const filterUsersAndTagsQuery = (): string => {
      const query = this.userRepository.manager
        .createQueryBuilder()
        .select('*')
        .from('user_tag', 'q1')
        .orWhere('"userId" = "user"."id"');

      if (user.id) {
        query.orWhere('"userId" = :userId', { userId: user.id });
        const [sql, params] = query.getQueryAndParameters();
        return sql.replace('$1', `'${params[0]}'`);
      }

      return query.getQuery();
    };

    const similarTags = (): SelectQueryBuilder<unknown> => {
      return this.userRepository.manager
        .createQueryBuilder()
        .select('count("userId")')
        .addSelect('"tagId"')
        .from(`(${filterUsersAndTagsQuery()})`, 'filteredUsers')
        .groupBy('"tagId"')
        .having('count("userId") > 1');
    };

    const similarTagsCount = (): string => {
      return this.userRepository.manager
        .createQueryBuilder()
        .select('count(*)')
        .from(`(${similarTags().getQuery()})`, 'similarTags')
        .getQuery();
    };

    const usersWithSimilarity = (): SelectQueryBuilder<unknown> => {
      return this.userRepository.manager
        .createQueryBuilder()
        .select('id, nickname, type, bio')
        .addSelect(`(${similarTagsCount()})`, 'similarTagsCount')
        .from(User, 'user');
    };

    const getSimilarTags = (id1: string, id2: string): Promise<TagDto[]> => {
      // SELECT DISTINCT (
      //   SELECT tag.id
      //   FROM tag join user_tag on tag.id = "tagId" join "user" "users" on "user".id = "userId"
      //   where "users".id = '6303ad9d-f9a2-40af-8570-85bb139f1d87'
      //   INTERSECT
      //   SELECT tag.id
      //   FROM tag join user_tag on tag.id = "tagId" join "user" "users" on "user".id = "userId"
      //   where "users".id = "user"."id"
      // )
      // FROM "user"

      const userTags = (uid: string) => {
        const query = this.userRepository.manager
          .createQueryBuilder()
          .select('"tag"."id"', 'id')
          .from(Tag, 'tag')
          .leftJoin('tag.users', 'users')
          .orWhere('users.id = :uid', { uid: uid })
          .andWhere('"tag"."id" is not Null');

        const [sql, params] = query.getQueryAndParameters();
        return sql.replace('$1', `'${params[0]}'`);
      };

      const tagsIntersection = (query: string) => {
        return this.userRepository.manager
          .createQueryBuilder()
          .distinct()
          .select(`(${query})`)
          .from(User, 'user');
      };

      return this.userRepository.manager.query(
        tagsIntersection(
          `${userTags(id1)} INTERSECT ${userTags(id2)}`,
        ).getQuery(),
      );
    };

    const users: SimilarUserDto[] = await Promise.all(
      (
        await usersWithSimilarity().getRawMany()
      )
        .filter((_user: SimilarUserDto) => _user.similarTagsCount > 0)
        .map(async (_user) => {
          return {
            ..._user,
            tags: (await getSimilarTags(user.id, _user.id)).filter(
              (tag) => tag.id != null,
            ),
          };
        }),
    );

    return users;
  }

  async findUsersByType(type: number): Promise<User[]> {
    return this.userRepository.find({
      where: {
        type: type
      }
    })
  }
}
