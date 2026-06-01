import { Injectable } from "@nestjs/common";
import { Entity } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
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
