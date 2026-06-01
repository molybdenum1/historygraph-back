import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Relation } from "@prisma/client";
import { CreateRelationDto, UpdateRelationDto } from "./dto/relation.dto";
import {
  RELATIONS_REPOSITORY,
  RelationsRepository,
} from "./repositories/relations.repository";

@Injectable()
export class RelationsService {
  constructor(
    @Inject(RELATIONS_REPOSITORY)
    private readonly relationsRepository: RelationsRepository,
  ) {}

  create(data: CreateRelationDto): Promise<Relation> {
    return this.relationsRepository.create(data);
  }

  findMany(): Promise<Relation[]> {
    return this.relationsRepository.findMany();
  }

  findForEntity(entityId: string): Promise<Relation[]> {
    return this.relationsRepository.findForEntity(entityId);
  }

  async findByIdOrThrow(id: string): Promise<Relation> {
    const relation = await this.relationsRepository.findById(id);

    if (!relation) {
      throw new NotFoundException(`Relation ${id} was not found`);
    }

    return relation;
  }

  update(id: string, data: UpdateRelationDto): Promise<Relation> {
    return this.relationsRepository.update(id, data);
  }
}
