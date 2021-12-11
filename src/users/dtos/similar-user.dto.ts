import { ApiProperty } from '@nestjs/swagger';
import { Chatroom } from 'src/chatrooms/enitities/chatroom.entity';
import { Message } from 'src/chatrooms/enitities/message.entity';
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
  @ApiProperty({
    type: [Message],
  })
  messages: Message[];
  @ApiProperty({
    type: [Chatroom],
  })
  chatrooms: Chatroom[];
  @ApiProperty()
  bio: string;
}
