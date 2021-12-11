import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsNotEmpty } from 'class-validator';
import { Tag } from '../../tags/entities/tag.entity';
export class CreateUserDto {
  @ApiProperty()
  @MinLength(9)
  phone: string;
  @ApiProperty()
  @IsNotEmpty()
  type: number;
  @ApiProperty()
  @MinLength(8)
  password: string;
  bio: string;
  tags: Tag[];
}
