import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Entity } from "@prisma/client";
import { EntityDetailResponseDto } from "./dto/entity-detail-response.dto";
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

  async findDetailByIdOrThrow(id: string): Promise<EntityDetailResponseDto> {
    const detail = await this.entitiesRepository.findDetailById(id);

    if (!detail) {
      throw new NotFoundException(`Entity ${id} was not found`);
    }

    return detail;
  }

  update(id: string, data: UpdateEntityDto): Promise<Entity> {
    return this.entitiesRepository.update(id, data);
  }
}
