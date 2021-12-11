import { Module } from '@nestjs/common';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Tag])],
  providers: [TagsService, UsersService],
  controllers: [TagsController],
  exports: [TypeOrmModule, TagsService],
})
export class TagsModule {}
