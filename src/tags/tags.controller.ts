import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagDto } from './dtos/tag.dto';
import { Tag, TagType } from './entities/tag.entity';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiResponse({
    status: 200,
    description: 'Returns all tags',
    type: [TagDto],
  })
  @Get()
  @HttpCode(200)
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Returns tags by type',
    type: [TagDto],
  })
  @Get(':type')
  @HttpCode(200)
  async findTagsByType(@Param('type') type: TagType): Promise<Tag[]> {
    return this.tagsService.findTagsByType(type);
  }
}
