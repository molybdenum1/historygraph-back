import { Injectable } from "@nestjs/common";
import { Entity } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { EntityDetailResponseDto } from "../dto/entity-detail-response.dto";
import { CreateEntityDto, UpdateEntityDto } from "../dto/entity.dto";
import { EntitiesRepository } from "./entities.repository";

@Injectable()
export class PrismaEntitiesRepository implements EntitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: CreateEntityDto,
    client: PrismaDbClient = this.prisma,
  ): Promise<Entity> {
    return client.entity.create({ data });
  }

  findById(id: string): Promise<Entity | null> {
    return this.prisma.entity.findUnique({ where: { id } });
  }

  async findDetailById(id: string): Promise<EntityDetailResponseDto | null> {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
      include: {
        incomingRelations: {
          include: { fromEntity: true },
          orderBy: { createdAt: "desc" },
        },
        outgoingRelations: {
          include: { toEntity: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!entity) {
      return null;
    }

    const connectedEntitiesById = new Map<string, Entity>();

    entity.incomingRelations.forEach((relation) => {
      connectedEntitiesById.set(relation.fromEntity.id, relation.fromEntity);
    });

    entity.outgoingRelations.forEach((relation) => {
      connectedEntitiesById.set(relation.toEntity.id, relation.toEntity);
    });

    return {
      entity: {
        id: entity.id,
        type: entity.type,
        name: entity.name,
        description: entity.description,
        dateStart: entity.dateStart,
        dateEnd: entity.dateEnd,
        createdAt: entity.createdAt,
      },
      incomingRelations: entity.incomingRelations.map(
        ({ fromEntity: _fromEntity, ...relation }) => relation,
      ),
      outgoingRelations: entity.outgoingRelations.map(
        ({ toEntity: _toEntity, ...relation }) => relation,
      ),
      connectedEntities: [...connectedEntitiesById.values()],
    };
  }

  findMany(): Promise<Entity[]> {
    return this.prisma.entity.findMany({ orderBy: { createdAt: "desc" } });
  }

  findByNameAndType(
    name: string,
    type: CreateEntityDto["type"],
    client: PrismaDbClient = this.prisma,
  ): Promise<Entity | null> {
    return client.entity.findUnique({
      where: { name_type: { name, type } },
    });
  }

  update(id: string, data: UpdateEntityDto): Promise<Entity> {
    return this.prisma.entity.update({ where: { id }, data });
  }
}
