import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Entity } from "@prisma/client";
import { CreateEntityDto, UpdateEntityDto } from "./dto/entity.dto";
import {
  ENTITIES_REPOSITORY,
  EntitiesRepository,
} from "./repositories/entities.repository";

@Injectable()
export class EntitiesService {
  constructor(
    @Inject(ENTITIES_REPOSITORY)
    private readonly entitiesRepository: EntitiesRepository,
  ) {}

  create(data: CreateEntityDto): Promise<Entity> {
    return this.entitiesRepository.create(data);
  }

  findMany(): Promise<Entity[]> {
    return this.entitiesRepository.findMany();
  }

  async findByIdOrThrow(id: string): Promise<Entity> {
    const entity = await this.entitiesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Entity ${id} was not found`);
    }

    return entity;
  }

  update(id: string, data: UpdateEntityDto): Promise<Entity> {
    return this.entitiesRepository.update(id, data);
  }
}
