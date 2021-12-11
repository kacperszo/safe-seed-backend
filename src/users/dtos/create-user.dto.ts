import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsNotEmpty, IsArray } from 'class-validator';
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
  @ApiProperty()
  bio: string;
  @IsArray()
  @ApiProperty()
  tags: string[];
}
