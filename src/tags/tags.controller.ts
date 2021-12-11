import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagDto } from './dtos/tag.dto';
import { Tag } from './entities/tag.entity';
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
}
