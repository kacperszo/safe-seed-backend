import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsNotEmpty, IsArray } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({ required: false })
  tags: string[];
  @ApiProperty({ required: false })
  bio: string;
}
