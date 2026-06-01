import { Relation } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { CreateRelationDto, UpdateRelationDto } from "../dto/relation.dto";

export const RELATIONS_REPOSITORY = Symbol("RELATIONS_REPOSITORY");

export interface RelationsRepository {
  create(data: CreateRelationDto, client?: PrismaDbClient): Promise<Relation>;
  findById(id: string): Promise<Relation | null>;
  findMany(): Promise<Relation[]>;
  findForEntity(entityId: string): Promise<Relation[]>;
  findByEndpointsAndType(
    fromEntityId: string,
    toEntityId: string,
    relationType: string,
    client?: PrismaDbClient,
  ): Promise<Relation | null>;
  update(id: string, data: UpdateRelationDto): Promise<Relation>;
}
