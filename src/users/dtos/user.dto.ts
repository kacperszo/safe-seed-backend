import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { TagDto } from 'src/tags/dtos/tag.dto';
import { Tag } from 'src/tags/entities/tag.entity';

export class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  type: number;
  @ApiProperty({
    type: [TagDto],
  })
  tags: Tag[];
}
