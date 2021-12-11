import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from 'src/tags/dtos/tag.dto';
import { Tag } from 'src/tags/entities/tag.entity';

export class SimilarUserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  similarTagsCount: number;
  @ApiProperty({
    type: [TagDto],
  })
  tags: Tag[];
}
