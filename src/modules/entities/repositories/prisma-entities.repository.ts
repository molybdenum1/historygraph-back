import { Injectable } from '@nestjs/common';
import { Entity } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateEntityDto, UpdateEntityDto } from '../dto/entity.dto';
import { EntitiesRepository } from './entities.repository';

@Injectable()
export class PrismaEntitiesRepository implements EntitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateEntityDto): Promise<Entity> {
    return this.prisma.entity.create({ data });
  }

  findById(id: string): Promise<Entity | null> {
    return this.prisma.entity.findUnique({ where: { id } });
  }

  findMany(): Promise<Entity[]> {
    return this.prisma.entity.findMany({ orderBy: { createdAt: 'desc' } });
  }

  update(id: string, data: UpdateEntityDto): Promise<Entity> {
    return this.prisma.entity.update({ where: { id }, data });
  }
}
