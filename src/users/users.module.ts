import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { TagsModule } from 'src/tags/tags.module';
import { ChatroomsModule } from 'src/chatrooms/chatrooms.module';
import { ChatroomsService } from 'src/chatrooms/chatrooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Tag]),
    TagsModule,
    ChatroomsModule,
  ],
  providers: [UsersService, ChatroomsService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
