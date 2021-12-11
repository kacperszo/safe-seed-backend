import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { TagDto } from 'src/tags/dtos/tag.dto';
import { Tag } from 'src/tags/entities/tag.entity';

export class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nickname: string;
  @ApiProperty({
    description: '0 - user, 1 - terapists, 2 - admin'
  })
  type: number;
  @ApiProperty({
    type: [TagDto],
  })
  @IsArray()
  tags: Tag[];
}
