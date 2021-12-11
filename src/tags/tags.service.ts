import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagDto } from "./dtos/tag.dto";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    ) {}

    async findAll(): Promise<TagDto[]> {
        return this.tagRepository.find();
    }
}