import { Entity } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { EntityDetailResponseDto } from "../dto/entity-detail-response.dto";
import { CreateEntityDto, UpdateEntityDto } from "../dto/entity.dto";

export const ENTITIES_REPOSITORY = Symbol("ENTITIES_REPOSITORY");

export interface EntitiesRepository {
  create(data: CreateEntityDto, client?: PrismaDbClient): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  findDetailById(id: string): Promise<EntityDetailResponseDto | null>;
  findMany(): Promise<Entity[]>;
  findByNameAndType(
    name: string,
    type: CreateEntityDto["type"],
    client?: PrismaDbClient,
  ): Promise<Entity | null>;
  update(id: string, data: UpdateEntityDto): Promise<Entity>;
}
