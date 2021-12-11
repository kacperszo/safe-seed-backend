import { ApiProperty } from '@nestjs/swagger';
import { TagType } from '../entities/tag.entity';

export class TagDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({
    description: 'Tag Types: PROBLEM, GOAL'
  })
  type: TagType;
}
