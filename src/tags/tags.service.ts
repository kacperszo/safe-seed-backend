import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag, TagType } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
  async findTagsByIds(ids: string[]): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .andWhere('tag.id IN (:...ids)', { ids })
      .getMany();
  }
  async findTagsByType(type: TagType): Promise<Tag[]> {
    return this.tagRepository.find({
      where: {
        type: type,
      },
    });
  }
}
