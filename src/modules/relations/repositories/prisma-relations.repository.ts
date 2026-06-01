import { Injectable } from "@nestjs/common";
import { Relation } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { CreateRelationDto, UpdateRelationDto } from "../dto/relation.dto";
import { RelationsRepository } from "./relations.repository";

@Injectable()
export class PrismaRelationsRepository implements RelationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: CreateRelationDto,
    client: PrismaDbClient = this.prisma,
  ): Promise<Relation> {
    return client.relation.create({ data });
  }

  findById(id: string): Promise<Relation | null> {
    return this.prisma.relation.findUnique({ where: { id } });
  }

  findMany(): Promise<Relation[]> {
    return this.prisma.relation.findMany({ orderBy: { createdAt: "desc" } });
  }

  findForEntity(entityId: string): Promise<Relation[]> {
    return this.prisma.relation.findMany({
      where: {
        OR: [{ fromEntityId: entityId }, { toEntityId: entityId }],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  findByEndpointsAndType(
    fromEntityId: string,
    toEntityId: string,
    relationType: string,
    client: PrismaDbClient = this.prisma,
  ): Promise<Relation | null> {
    return client.relation.findUnique({
      where: {
        fromEntityId_toEntityId_relationType: {
          fromEntityId,
          toEntityId,
          relationType,
        },
      },
    });
  }

  update(id: string, data: UpdateRelationDto): Promise<Relation> {
    return this.prisma.relation.update({ where: { id }, data });
  }
}
